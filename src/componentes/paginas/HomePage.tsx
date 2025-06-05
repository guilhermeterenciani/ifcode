import './Paginas-CSS/homepag.css'
import { Link } from "react-router"

export default function HomePage() {
    return(
        <div>
            <h1>Bem Vindo!</h1>
            <Link to='/Code_Runner' className='codeLink'>Programar</Link>
        </div>
    )
}