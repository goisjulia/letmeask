import toast, { Toaster } from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';
import CopyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
        toast.success('Copiado');
    }

    return (
        <>
            <button
                className="room-code"
                onClick={copyRoomCodeToClipboard}
                data-tip="Copiar código da sala"
                data-for="tooltip-room-code"
            >
                <span>
                    Sala #{props.code}
                </span>
                <img src={CopyImg} alt="Copiar código da sala" />
            </button>

            <Toaster
                position="bottom-center"
            />

            <ReactTooltip id="tooltip-room-code" place="left" type="dark" effect="solid" />
        </>
    )
}