import ReactTooltip from 'react-tooltip';
import CopyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyCopyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code);
    }

    return (
        <>
            <button
                className="room-code"
                onClick={copyCopyRoomCodeToClipboard}
                data-tip="Copiar"
                data-for="tooltip-room-code"
            >
                <span>
                    Sala #{props.code}
                </span>
                <img src={CopyImg} alt="Copy room code" />
            </button>

            <ReactTooltip id="tooltip-room-code" place="left" type="dark" effect="solid" />
        </>
    )
}