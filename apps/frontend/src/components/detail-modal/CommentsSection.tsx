import { formatSoleniaDate } from '../../utils/solenia-date';
import type { DetailComment } from './detailModalTypes';

export function CommentsSection({ comments }: { comments?: DetailComment[] }) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="detail-section comments-section">
      <h3>Notes ({comments.length})</h3>
      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            {c.dateInGame && <span className="comment-date">{formatSoleniaDate(c.dateInGame)}</span>}
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
