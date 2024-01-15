// QuizApp.js
// src/QuizApp.js

// src/QuizApp.js
/*
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

const QuizApp = ({ app, db }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchRandomQuestions = async () => {
      try {
        const data = await getDocs(collection(db, 'QuizQuestions'));
        const allQuestions = data.docs.map(doc => doc.data());

        // Shuffle questions to get a random order
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

        // Select the first 3 questions
        const selectedQuestions = shuffledQuestions.slice(0, 3);
        setQuestions(selectedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchRandomQuestions();
  }, [db]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);

    // Check if the selected answer is correct
    if (answerIndex === questions[currentQuestion]?.Correct_Answer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Move to the next question after a brief delay
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        // Quiz completed
        alert(`Quiz completed!\nYour final score is: ${score} out of ${questions.length}`);
        // You can add additional logic to handle quiz completion
      }
    }, 2000);
  };

  return (
    <div>
      {questions.length > 0 ? (
        currentQuestion < questions.length ? (
          <div>
            <h3>Question {currentQuestion + 1}</h3>
            <p>{questions[currentQuestion]?.Question}</p>
            <div>
              {[questions[currentQuestion]?.Option1, questions[currentQuestion]?.Option2].map(
                (option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
            {selectedAnswer !== null && (
              <div>
                <p>
                  {selectedAnswer === questions[currentQuestion]?.Correct_Answer
                    ? 'Correct!'
                    : 'Incorrect!'}
                </p>
                <p>
                  Correct Answer: {questions[currentQuestion]?.Correct_Answer === 0
                    ? questions[currentQuestion]?.Option1
                    : questions[currentQuestion]?.Option2}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Quiz completed
          <div>
            <h3>Quiz Completed</h3>
            <p>Your final score is: {score} out of {questions.length}</p>
          </div>
        )
      ) : (
        // Loading or no questions
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default QuizApp;


// src/QuizApp.js
// src/QuizApp.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';

const QuizApp = ({ app, db }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomQuestions = async () => {
      try {
        const data = await getDocs(collection(db, 'QuizQuestions'));
        const allQuestions = data.docs.map(doc => doc.data());

        // Shuffle questions to get a random order
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

        // Select the first 3 questions
        const selectedQuestions = shuffledQuestions.slice(0, 3);
        setQuestions(selectedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Set a timeout to ensure loading is set to false after a reasonable time
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    fetchRandomQuestions();
     

    return () => clearTimeout(loadingTimeout);
      }, [db]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);

    // Check if the selected answer is correct
    if (answerIndex === questions[currentQuestion]?.Correct_Answer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Move to the next question after a brief delay
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        // Quiz completed
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const renderQuizContent = () => (
    <div>
      <h3>Question {currentQuestion + 1}</h3>
      <p>{questions[currentQuestion]?.Question}</p>
      <div>
        {[questions[currentQuestion]?.Option1, questions[currentQuestion]?.Option2].map(
          (option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          )
        )}
      </div>
      {selectedAnswer !== null && (
        <div>
          <p>
            {selectedAnswer === questions[currentQuestion]?.Correct_Answer
              ? 'Correct!'
              : 'Incorrect!'}
          </p>
          <p>
            Correct Answer: {questions[currentQuestion]?.Correct_Answer === 0
              ? questions[currentQuestion]?.Option1
              : questions[currentQuestion]?.Option2}
          </p>
        </div>
      )}
    </div>
  );

  const renderQuizCompleted = () => (
    <div>
      <h3>Quiz Completed</h3>
      <p>Your final score is: {score} out of {questions.length}</p>
    </div>
  );

  return (
    <div>
      {loading ? (
        // Loading screen
        <p>Loading questions...</p>
      ) : quizCompleted ? (
        // Quiz completed screen
        renderQuizCompleted()
      ) : (
        // Quiz content
        renderQuizContent()
      )}
    </div>
  );
};

export default QuizApp;
*/

// src/QuizApp.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';



const QuizApp = ({ app }) => {
  const db = getFirestore();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect is running...');

    const fetchRandomQuestions = async () => {
      try {
        console.log('Fetching questions...');
        const data = await getDocs(collection(db, 'QuizQuestions'));
        console.log('Fetching1questions...');
        const allQuestions = data.docs.map(doc => doc.data());
        console.log('All questions:', allQuestions);

  
        // Shuffle questions to get a random order
        const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
  
        // Select the first 3 questions
        const selectedQuestions = shuffledQuestions.slice(0, 3);
        setQuestions(selectedQuestions);
        setQuizCompleted(false);
        console.log('Questions loaded:', selectedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Fetch questions
    fetchRandomQuestions();
  }, [db]);

  
  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);

    // Check if the selected answer is correct
    if (answerIndex === questions[currentQuestion]?.Correct_Answer) {
      setScore((prevScore) => prevScore + 1);
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else {
        // Quiz completed
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const renderQuizContent = () => (
    <div>
      <h3>Question {currentQuestion + 1}</h3>
      <p>{questions[currentQuestion]?.Question}</p>
      <div>
        {[questions[currentQuestion]?.Option1, questions[currentQuestion]?.Option2].map(
          (option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          )
        )}
      </div>
      {selectedAnswer !== null && (
        <div>
          <p>
            {selectedAnswer === questions[currentQuestion]?.Correct_Answer
              ? 'Correct!'
              : 'Incorrect!'}
          </p>
          <p>
            Correct Answer: {questions[currentQuestion]?.Correct_Answer === 0
              ? questions[currentQuestion]?.Option1
              : questions[currentQuestion]?.Option2}
          </p>
        </div>
      )}
    </div>
  );

  const renderQuizCompleted = () => (
    // Content remains unchanged...
    <div>
      <h3>Quiz Completed</h3>
      <p>Your final score is: {score} out of {questions.length}</p>
    </div>
  );
  

  return (
    <div>
      {loading ? (
        // Loading screen
        <p>Loading questions...</p>
      ) : quizCompleted ? (
        // Quiz completed screen
        renderQuizCompleted()
      ) : (
        // Quiz content
        renderQuizContent()
      )}
    </div>
  );
};

export default QuizApp;
