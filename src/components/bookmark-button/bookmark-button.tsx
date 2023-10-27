import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AppRoute, AuthorizationStatus } from '../../const';
import { Offer } from '../../types/offers-types';
import { addFavorite, deleteFavorite } from '../../store/api-action';
import { getAuthorizationStatus } from '../../store/user-data/user-data.selectors';
import classNames from 'classnames';

type BookmarkButtonProps = {
  id: Offer['id'];
  isFavorite: Offer['isFavorite'];
  type: string;
  onClick: () => void;
};

function BookmarkButton({
  id,
  isFavorite,
  type,
  onClick,
}: BookmarkButtonProps): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const handleBookmarkButtonClick = () => {
    if (authorizationStatus === AuthorizationStatus.NoAuth) {
      navigate(AppRoute.Login);
    }

    onClick();

    if (isFavorite) {
      dispatch(deleteFavorite(id));
      localStorage.removeItem(`favorite_${id}`);
    } else {
      dispatch(addFavorite(id));
      localStorage.setItem(`favorite_${id}`, 'true');
    }
  };

  return (
    <button
      className={classNames(`${type}__bookmark-button`, 'button', {
        [`${type}__bookmark-button--active`]:
          isFavorite && authorizationStatus === AuthorizationStatus.Auth,
      })}
      type="button"
      onClick={handleBookmarkButtonClick}
    >
      <svg
        className={classNames(`${type}__bookmark-icon`)}
        width={type === 'offer' ? 31 : 18}
        height={type === 'offer' ? 33 : 19}
      >
        <use xlinkHref="#icon-bookmark"></use>
      </svg>
      <span className="visually-hidden">To bookmarks</span>
    </button>
  );
}

export default BookmarkButton;
