import { useEffect, useState } from "react";
import { database } from '../services/firebase';
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>;
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');


    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            });

            const highlithedQuestions = parsedQuestions.filter(question => question.isHighlighted);
            const unsetQuestions = parsedQuestions.filter(question => !question.isHighlighted && !question.isAnswered);
            const unsetQuestionsWithoutLikes = unsetQuestions.filter(question => question.likeCount === 0);
            let unsetQuestionsWithLikes = unsetQuestions.filter(question => question.likeCount !== 0);
            const answeredQuestions = parsedQuestions.filter(question => question.isAnswered);

            console.log(unsetQuestionsWithLikes);

            unsetQuestionsWithLikes.sort(function (x, y) {
                const res =  (x.likeCount < y.likeCount) ? 0 : x.likeCount ? -1 : 1;
                console.log(x);
                console.log(y);
                console.log(res);
                return res;
            });

            console.log(unsetQuestionsWithLikes);

            const sortedQuestions = highlithedQuestions.concat(unsetQuestionsWithLikes).concat(unsetQuestionsWithoutLikes).concat(answeredQuestions);

            console.log(sortedQuestions);

            setTitle(databaseRoom.title);
            setQuestions(sortedQuestions);
        });

        return () => { roomRef.off('value') }

    }, [roomId, user?.id]);

    return { questions, title };
}
