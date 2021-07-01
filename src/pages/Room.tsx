import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';
import ReactTooltip from 'react-tooltip';
import toast, { Toaster } from 'react-hot-toast';

type RoomParams = {
    id: string;
}

export function Room() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();
    const [newQuestion, setNewQuestion] = useState('');
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    async function handleGoToHome() {
        if (window.confirm('Você realmente deseja sair da sala?')) {
            history.push('/');
        }
    }

    async function handleLoginUser() {
        if (!user) {
            await signInWithGoogle();
        }
    }

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            toast.error('Usuário deve estar logado');
            return;
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await database.ref(`/rooms/${roomId}/questions`).push(question);

        toast.success('Enviado com sucesso');

        setNewQuestion('');
    }

    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            });
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <button onClick={handleGoToHome}>
                        <img src={logoImg} alt="Let Me Ask" />
                    </button>
                    <RoomCode code={roomId} />
                </div>
                <div className="footer" />
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} {questions.length === 1 ? (<>pergunta</>) : (<>perguntas</>)} </span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar? 🤔"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button onClick={handleLoginUser}>faça o seu login</button>.</span>
                        )}
                        <Button type="submit" disabled={!user || !newQuestion}>Enviar pergunta</Button>
                    </div>
                </form>

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
                                    {!question.isAnswered && (
                                        <button
                                            className={`like-button ${question.likeId ? 'liked' : ''}`}
                                            type="button"
                                            aria-label="Marcar como gostei"
                                            onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                            data-tip="Curtir"
                                            data-for="tooltip-question"
                                        >
                                            👍
                                            {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                        </button>
                                    )}

                                    <ReactTooltip id="tooltip-question" place="bottom" type="dark" effect="solid" />

                                </Question>
                            );
                        })) : (
                        <div className="no-questions">
                            <img src={emptyQuestionsImg} alt="Ilustração com balões de fala" />
                            <span className="title">Nenhuma pergunta por aqui...</span>
                            <span>Seja a primeira pessoa a fazer uma pergunta!</span>
                        </div>
                    )}
                </div>

                <Toaster
                    position="bottom-center"
                />

            </main>
        </div>
    )
}
