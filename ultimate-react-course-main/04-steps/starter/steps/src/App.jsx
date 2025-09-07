// import { useState } from 'react'
// import './index.css'

// const messages = ['Learn React ⚛️', 'Apply for jobs 💼', 'Invest your new income 🤑']

// function App() {
//     const [step, setStep] = useState(1)
//     const [isOpen, seIsOpen] = useState(true)

//     const handlePrevious = () => step > 1 && setStep(s => s - 1)
//     const handleNext = () => step < 3 && setStep(s => s + 1)

//     return (
//         <>
//             <button className="close" onClick={() => seIsOpen(isOpen => !isOpen)}>
//                 &times;
//             </button>
//             {isOpen && (
//                 <div className="steps">
//                     <div className="numbers">
//                         <div className={step >= 1 ? 'active' : ''}>1</div>
//                         <div className={step >= 2 ? 'active' : ''}>2</div>
//                         <div className={step >= 3 ? 'active' : ''}>3</div>
//                     </div>

//                     <p className="message">
//                         Step {step}: {messages[step - 1]}
//                     </p>

//                     <div className="buttons">
//                         <button style={{ backgroundColor: '#7950f2', color: '#fff' }} onClick={handlePrevious}>
//                             Previous
//                         </button>
//                         <button style={{ backgroundColor: '#7950f2', color: '#fff' }} onClick={handleNext}>
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

// export default App

import { useState } from 'react'
import './index.css'

const messages = ['Learn React ⚛️', 'Apply for jobs 💼', 'Invest your new income 🤑']

function App() {
    const [step, setStep] = useState(1)
    const [isOpen, seIsOpen] = useState(true)

    const handlePrevious = () => step > 1 && setStep(s => s - 1)
    const handleNext = () => step < 3 && setStep(s => s + 1)

    return (
        <>
            <button className="close" onClick={() => seIsOpen(isOpen => !isOpen)}>
                &times;
            </button>
            {isOpen && (
                <div className="steps">
                    <div className="numbers">
                        <div className={step >= 1 ? 'active' : ''}>1</div>
                        <div className={step >= 2 ? 'active' : ''}>2</div>
                        <div className={step >= 3 ? 'active' : ''}>3</div>
                    </div>

                    <StepMessage step={step}>{messages[step - 1]}</StepMessage>

                    <div className="buttons">
                        <Button bg="#7950f2" color="#fff" handleClick={handlePrevious}>
                            <span>👈</span>Previous
                        </Button>
                        <Button bg="#7950f2" color="#fff" handleClick={handleNext}>
                            Next<span>👉</span>
                        </Button>
                    </div>
                    <StepMessage step={1}>
                        <p>some content</p>
                    </StepMessage>
                    <div className="buttons">
                        <Button bgr="#e7e7e7" color="#000" onClick={() => alert('Hello')}>
                            HELLO
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

function Button({ handleClick, bg, color, children }) {
    return (
        <button style={{ backgroundColor: bg, color: color }} onClick={handleClick}>
            {children}
        </button>
    )
}

function StepMessage({ step, children }) {
    return (
        <p className="message">
            <h3>Step {step}</h3>
            {children}
        </p>
    )
}

export default App
