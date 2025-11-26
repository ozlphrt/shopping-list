import { useItems } from '../hooks/useItems';
import './ProgressBar.css';

interface ProgressBarProps {
  listId: string | null;
}

export const ProgressBar = ({ listId }: ProgressBarProps) => {
  const { items } = useItems(listId);
  const pickedCount = items.filter(item => item.picked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (pickedCount / totalCount) * 100 : 0;

  if (totalCount === 0) return null;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-card">
        <div className="progress-bar-header">
          <div className="progress-bar-label">Shopping Progress</div>
          <div className="progress-bar-text">{pickedCount}/{totalCount}</div>
        </div>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

