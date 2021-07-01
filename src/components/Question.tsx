import { ReactNode } from 'react';
import '../styles/questions.scss';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount?: number;
}

export function Question({
    content,
    author,
    isAnswered = false,
    isHighlighted = false,
    likeCount = 0,
    children,
}: QuestionProps) {
    return (
        <div
            className={cx('question',
                { answered: isAnswered },
                { highlighted: isHighlighted && !isAnswered }
            )}
        >
            <div className="content">
                <span>{content}</span>

                <div>
                    {likeCount > 0 && (
                        <span
                            className="label"
                            data-tip="Curtidas"
                            data-for="tooltip-question-admin"
                        >
                            {likeCount > 0 && (<>👍</>)} {likeCount || ''}
                        </span>
                    )}
                </div>
            </div>

            <ReactTooltip id="tooltip-question-admin" place="left" type="dark" effect="solid" />

            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div >
    );
}