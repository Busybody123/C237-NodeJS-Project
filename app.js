// Setup
const express = require('express');
const mysql = require('mysql2');
const app = express();
const multer = require('multer');

// Directory to save uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create MySQL connection
const connection = mysql.createConnection({
    //host: 'localhost',
    //user: 'root',
    //password: '',
    //database: 'quizdb'
    host: 'sql.freedb.tech',
    database: 'freedb_freedb_project',
    user: 'freedb_Testing',
    password: 'P7T3Jxe%2UGVRFB'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// Set up view engine, static files & form processing
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Define routes
app.get('/', (req, res) => {
    const sql = `
        SELECT quizzes.*, COUNT(questions.questionId) AS total_questions, SUM(questions.marks) AS total_marks
        FROM quizzes
        LEFT JOIN questions ON quizzes.quizId = questions.quizId
        GROUP BY quizzes.quizId`;

    // Fetch data from SQL
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving quizzes');
        }
        // Render HTML page with data
        res.render('index', { quizzes: results });
    });
});

app.get('/startQuiz/:quizId/:questionId', (req, res) => {
    const quizId = req.params.quizId;
    const questionId = req.params.questionId;
    const nextQuestionId = questionId;

    const getHighestId = 'SELECT MAX(questionId) as highestId FROM questions WHERE quizId = ?'
    connection.query(getHighestId, [quizId], (getHighestError, getHighestResult) => {
        if (getHighestError) {
            console.error("Error fetching nextQuestionId:", getHighestError.message);
            res.status(500).send("Error fetching nextQuestionId")
        } else {

            if (getHighestResult.length > 0) {
                const highestId = getHighestResult[0].highestId;

                if (nextQuestionId > highestId) {
                    res.redirect('/quizCompleted');
                } else {

                    const sql = `SELECT questions.*, quizzes.name AS quiz_name FROM questions LEFT JOIN quizzes \
                    ON questions.quizId = quizzes.quizId WHERE questions.quizId = ? AND questions.questionId = ?`;

                    // Fetch data from SQL
                    connection.query(sql, [quizId, questionId], (error, results) => {
                        if (error) {
                            console.error('Database query error:', error.message);
                            return res.status(500).send('Internal Server Error');
                        } else {

                            if (results.length > 0) {
                                // split str into array by comma
                                results[0].options = results[0].options.split(',');
                                res.render('startQuiz', { question: results[0] });
                            } else {
                                res.status(404).send('Question not found');
                            }
                        }
                    });
                }
            } else {
                res.status(404).send('No questions found for this quiz');
            }
        }
    })
});


app.get('/leaderboard', (req, res) => {
    const sql = `
    SELECT leaderboard.*, SUM(questions.marks) AS total_marks, quizzes.name AS quiz_name
        FROM questions
        LEFT JOIN quizzes ON questions.quizId = quizzes.quizId
        LEFT JOIN leaderboard ON quizzes.quizId = leaderboard.quizId
        GROUP BY questions.quizId
        ORDER BY quiz_name, total_marks`

    // Fetch data from SQL
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving leaderboard');
        }
        // Render HTML page with data
        res.render('leaderboard', { leaderboard: results });
    });
});



app.get('/editQuiz/:id', (req, res) => {
    const quizId = req.params.id;
    const sql = 'SELECT questions.*, quizzes.name AS quiz_name FROM questions \
    LEFT JOIN quizzes ON questions.quizId = quizzes.quizId WHERE questions.quizId = ?';

    connection.query(sql, [quizId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Internal Server Error');
        }

        if (results == 0) {
            res.render('editQuiz', {quiz: [], quizId: quizId});
        } else {
            results.forEach(question => {
                question.options = question.options.split(',');
            });
            res.render('editQuiz', { quiz: results });
        }
    });
});

app.get('/addQuiz', (req, res) => {
    res.render('addQuiz');
});

app.post('/addQuiz', upload.single('image'), (req, res) => {
    const { name, description } = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }

    const sql = 'INSERT INTO quizzes (name, description, image) VALUES (?, ?, ?)';
    connection.query(sql, [name, description, image], (error, results) => {
        if (error) {
            console.error("Error adding quiz:", error);
            res.status(500).send('Error adding quiz');
        } else {
            res.redirect('/')
        }
    })
});





app.get('/addQuestion/:quizId', (req, res) => {
    const quizId = req.params.quizId;
    res.render('addQuestion', { quizId });
});

app.post('/addQuestion/:quizId', upload.single('image'), (req, res) => {
    const quizId = req.params.quizId;
    const { question, option1, option2, option3, option4, answer, marks } = req.body;
    const options = [option1, option2, option3, option4];
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }

    // max questionId of quizId
    const getHighestId = 'SELECT MAX(questionId) AS highestId FROM questions WHERE quizId = ?';
    connection.query(getHighestId, [quizId], (highestIdError, highestIdResult) => {
        if (highestIdError) {
            console.error("Error fetching highest questionId:", highestIdError);
            return res.status(500).send('Error adding question');
        } else {

            // get next questionId
            let nextQuestionId = highestIdResult[0].highestId + 1;

            // insert new question
            const insertSql = 'INSERT INTO questions (quizId, questionId, question, options, answer, marks, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
            connection.query(insertSql, [quizId, nextQuestionId, question, options.join(','), answer, marks, image], (insertError, insertResult) => {
                if (insertError) {
                    console.error("Error inserting question:", insertError);
                    return res.status(500).send('Error adding question');
                }
                res.redirect(`/editQuiz/${quizId}`);
            });
        };
    });
});

app.get('/editQuestion/:quizId/:questionId', (req, res) => {
    const quizId = req.params.quizId;
    const questionId = req.params.questionId;
    const sql = 'SELECT * FROM questions WHERE quizId = ? AND questionId = ?';
    connection.query(sql, [quizId, questionId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            // split option by comma
            results[0].options = results[0].options.split(',');
            res.render('editQuestion', { question: results[0] });
        } else {
            res.status(404).send('Question not found');
        }
    });
});

app.post('/editQuestion/:quizId/:questionId', upload.single('image'), (req, res) => {
    const questionId = req.params.questionId;
    const quizId = req.params.quizId;
    const { question, option1, option2, option3, option4, answer, marks, currentImage } = req.body;
    const options = [option1, option2, option3, option4];

    let image = currentImage; // retrieve current image filename
    if (req.file) { // if a new image is uploaded
        image = req.file.filename; // set image to be the new image filename
    }

    const sql = 'UPDATE questions SET question = ?, options = ?, answer = ?, marks = ?, image = ? WHERE questionId = ? AND quizId = ?';
    connection.query(sql, [question, options.join(','), answer, marks, image, questionId, quizId], (error, results) => {
        if (error) {
            console.error("Error updating question:", error);
            res.status(500).send('Error updating question');
        } else {
            res.redirect(`/editQuiz/${quizId}`);
        }
    });
});


app.get('/deleteQuestion/:quizId/:questionId', (req, res) => {
    const questionId = req.params.questionId;
    const quizId = req.params.quizId;

    const sql = 'DELETE FROM questions WHERE questionId = ? AND quizId = ?';
    connection.query(sql, [questionId, quizId], (error, results) => {
        if (error) {
            console.error("Error deleting question:", error);
            res.status(500).send('Error deleting question');
        } else {
            const shiftIds = 'UPDATE questions SET questionId = questionId-1 WHERE quizId = ? AND questionId > ?';
            connection.query(shiftIds, [quizId, questionId], (shiftError, shiftResults) => {
                if (shiftError) {
                    console.error("Error updating questionId:", shiftError);
                    res.status(500).send('Error updating questionId');
                } else {
                    res.redirect(`/editQuiz/${quizId}`);
                }
            })
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));