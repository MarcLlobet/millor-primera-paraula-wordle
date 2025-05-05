import { useEffect, useState } from 'react'
import './App.css'

const getGreeting = async function () {
    const res = await fetch(
        'https://wordle-app-33d0a5d98822.herokuapp.com/api',
        {
            method: 'GET',
            mode: 'no-cors',
        }
    )
    return await res.json()
}

function App() {
    const [millorEntrada, setMillorEntrada] = useState('')

    useEffect(() => {
        getGreeting().then((res) => setMillorEntrada(res.millorEntrada?.origen))
    }, [])

    return (
        <>
            <p>
                Millor primera paraula: <span>{millorEntrada}</span>
            </p>
        </>
    )
}

export default App
