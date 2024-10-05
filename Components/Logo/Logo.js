import { faBrain } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Logo = () =>{
    return(
        <div className="text-3xl pt-4 pb-2 font-poppins">
            BloG-OpenAI
            <FontAwesomeIcon className="text-slate-600 ml-1" icon={faBrain}/>
        </div>
    )
}