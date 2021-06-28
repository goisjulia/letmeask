import { Link, useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

import deleteImg from '../assets/images/delete.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import '../styles/room.scss';
import { database } from '../services/firebase';
import ReactTooltip from 'react-tooltip';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        history.push('/');
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
            isHighlighted: false,
        });

    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Você tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <Link to="/">
                        <img src={logoImg} alt="Let Me Ask" />
                    </Link>
                    <div>
                        <RoomCode code={roomId} />
                        <Button
                            onClick={handleEndRoom}
                            isOutlined
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
                <div className="footer" />

            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} {questions.length === 1 ? (<>pergunta</>) : (<>perguntas</>)} </span>}
                </div>

                <div className="question-list">
                    {questions.length ? (

                        questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {question.likeCount > 0 && (
                                        <span
                                            className="label"
                                            data-tip="Curtidas"
                                            data-for="tooltip-question-admin"
                                        >
                                            {question.likeCount > 0 && (<>👍</>)} {question.likeCount || ''}
                                        </span>
                                    )}
                                    {!question.isAnswered && (
                                        <>
                                            <button
                                                type="button"
                                                data-tip="Concluir"
                                                data-for="tooltip-question-admin"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                            >
                                                <img src={checkImg} alt="Marcar pergunta como concluída" />
                                            </button>
                                            <button
                                                type="button"
                                                data-tip="Destacar"
                                                data-for="tooltip-question-admin"
                                                onClick={() => handleHighlightQuestion(question.id)}
                                            >
                                                <img src={answerImg} alt="Dar destaque a pergunta" />
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        data-tip="Remover"
                                        data-for="tooltip-question-admin"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>

                                    <ReactTooltip id="tooltip-question-admin" place="bottom" type="dark" effect="solid" />
                                </Question>
                            );
                        })
                    ) : (
                        <div className="no-questions">
                            <img src={emptyQuestionsImg} alt="Ilustração com balões de fala" />
                            <span className="title">Nenhuma pergunta por aqui...</span>
                            <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}