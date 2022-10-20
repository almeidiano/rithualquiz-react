import {useEffect, useState} from 'react';
import quizStyle from '../assets/css/quiz.module.css';
import { useNavigate } from "react-router-dom";
import fetchQuestions from '../assets/js/questions.js';

function FetchQuestionsAndAnswers() {
  const [buttonList, setButtonList] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [question, setQuestion] = useState('');
  const [playerAttributes, setPlayerAttributes] = useState({intro:0,charisma:0,extro:0,intellectual:0});
  let navigate = useNavigate();

    useEffect(() => {
      async function getAnswers() {
        return new Promise((resolve, reject) => {
          if(fetchQuestions()[currentQuestion]) {
            resolve(setButtonList(fetchQuestions(localStorage.getItem('playerNick'))[currentQuestion]));
          }
        })
      }

      async function getQuestions() {
        return new Promise((resolve, reject) => {
          if(fetchQuestions()[currentQuestion]) {
            resolve(setQuestion(fetchQuestions(localStorage.getItem('playerNick'))[currentQuestion].question));
          }else{
            reject(finishQuiz(), navigate('/Result'));
          }
        })
      }

      getQuestions();
      getAnswers();
      console.log(playerAttributes);
    }, [currentQuestion, playerAttributes])

    const applyQuestion = (btn) => {
      setCurrentQuestion(currentQuestion + 1);
      sumPlayerAttributes(btn.currentTarget);
    }

    function finishQuiz() {
      let finalCharSelected = Object.keys(playerAttributes).reduce((a, b) => {
        return playerAttributes[a] > playerAttributes[b] ? a : b
      });

			localStorage.setItem("allCharacters", JSON.stringify(playerAttributes));
			localStorage.setItem("charResult", finalCharSelected);
    }

    function sumPlayerAttributes(btn) {
        let dataChar;
        let dataEffect;
    
        dataChar = btn.getAttribute("data-char");
        dataEffect = parseInt(btn.getAttribute("data-effect"));
    
        let charEffects = new Object();
        charEffects[dataChar] = dataEffect;

        if(buttonList.typeOf == "dynamic") {
            let focus = buttonList.focus;
            let opposite = buttonList.opposite;
    
            switch(dataChar) {
                case focus:
                Object.keys(playerAttributes).forEach(key => {
                    if(Object.keys(charEffects) == key){
                      setPlayerAttributes(playerAttributes => ({...playerAttributes, [focus]: playerAttributes[focus] += dataEffect}));
                      setPlayerAttributes(playerAttributes => ({...playerAttributes, [opposite]: playerAttributes[opposite] -= dataEffect}));
                    }
                })
                break;
                case opposite:
                Object.keys(playerAttributes).forEach(key => {
                    if(Object.keys(charEffects) == key){
                      setPlayerAttributes(playerAttributes => ({...playerAttributes, [focus]: playerAttributes[focus] += dataEffect}));
                      setPlayerAttributes(playerAttributes => ({...playerAttributes, [opposite]: playerAttributes[opposite] -= dataEffect}));
                    }
                })
                break;
            }
        }else{
          Object.keys(playerAttributes).forEach(key => {
            if(Object.keys(charEffects) == key){
                setPlayerAttributes(playerAttributes => ({...playerAttributes, [key]: playerAttributes[key] += dataEffect}));
            }
          })
        }
    }

  return (
    <div>
      {buttonList && question && <div><div className={quizStyle.question}><span className="highlight">{currentQuestion + 1}.</span><span className={quizStyle.question_text}>{question}</span></div>
        <div className={quizStyle.btnsArea}>
          {buttonList && buttonList.answers.map((item) => (
            <button onClick={applyQuestion} key={item.id} data-effect={item.effect} data-char={item.characteristic} className='btn'>{item.answer}</button>
          ))}
        </div>
      </div>}
    </div>
  )
}

export default FetchQuestionsAndAnswers