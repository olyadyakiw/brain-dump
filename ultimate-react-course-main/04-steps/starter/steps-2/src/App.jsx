import { useState } from 'react'
import './index.css'

const messages = ['Learn React ⚛️', 'Apply for jobs 💼', 'Invest your new income 🤑']

export default function App() {
    return (
        <>
            <Steps />
            <Steps />
        </>
    )
}

function Steps() {
    const [step, setStep] = useState(1)
    const [isOpen, seIsOpen] = useState(true)

    const handlePrevious = () => {
        step > 1 && setStep(s => s - 1)
    }

    const handleNext = () => {
        step < messages.length && setStep(s => s + 1)
    }

    return (
        <div>
            <button className="close" onClick={() => seIsOpen(is => !is)}>
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
                        <Button bgColor="#7950f2" textColor="#fff" onClick={handlePrevious}>
                            👈 Previous
                        </Button>
                        <Button bgColor="#7950f2" textColor="#fff" onClick={handleNext}>
                            Next 👉
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

function StepMessage({ step, children }) {
    return (
        <div className="message">
            <h3> Step {step}</h3>
            {children}
        </div>
    )
}

function Button({ textColor, bgColor, onClick, children }) {
    return (
        <button style={{ backgroundColor: bgColor, color: textColor }} onClick={onClick}>
            {children}
        </button>
    )
}
