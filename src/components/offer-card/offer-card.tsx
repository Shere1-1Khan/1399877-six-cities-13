import {memo, useState, useCallback,useEffect } from 'react';
import {Link} from 'react-router-dom';
import {AppRoute} from '../../const';
import { Offer } from '../../types/offers-types';
import BookmarkButton from '../bookmark-button/bookmark-button';
import classNames from 'classnames';

type OfferCardProps = {
  offer: Offer;
  type: 'cities' | 'near-places' | 'favorites';
  onOfferCardHover?: (id: string | undefined) => void;
}

function OfferCard({offer, type, onOfferCardHover}: OfferCardProps): JSX.Element {
  const [activeFavorite, setActiveFavorite] = useState(offer.isFavorite);

  useEffect(() => {
    const favoriteFromStorage = localStorage.getItem(`favorite_${offer.id}`);
    if (favoriteFromStorage === 'true') {
      setActiveFavorite(true);
    }
  }, [offer.id]);

  const handleOfferCardHover = useCallback(() => {
    onOfferCardHover?.(offer.id);
  }, [offer.id , onOfferCardHover]);

  const handleOfferCardLeave = useCallback(() => {
    onOfferCardHover?.(undefined);
  }, [onOfferCardHover]);

  return (
    <article className={classNames({
      'place-card': true,
      'cities__card': type === 'cities',
      'near-places__card': type === 'near-places',
      'favorites__card': type === 'favorites',
    })}
    onMouseEnter={() => handleOfferCardHover()}
    onMouseLeave={() => handleOfferCardLeave()}
    >
      {offer.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>}
      <div className={classNames({
        'place-card__image-wrapper': true,
        'cities__image-wrapper': type === 'cities',
        'near-places__image-wrapper': type === 'near-places',
        'favorites__image-wrapper': type === 'favorites',
      })}
      >
        <Link to={`${AppRoute.Offer}/${offer.id}`}>
          <img className="place-card__image" src={offer.previewImage} width={type === 'favorites' ? 150 : 260} height={type === 'favorites' ? 110 : 200} alt="Place image"/>
        </Link>
      </div>
      <div className={classNames({
        'place-card__info': true,
        'favorites__card-info': type === 'favorites',
      })}
      >
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <BookmarkButton id={offer.id} isFavorite={activeFavorite} type='place-card' onClick={() => setActiveFavorite((prev) => !prev)}/>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${Math.round(offer.rating) * 100 / 5}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${offer.id}`}>
            {offer.title}
          </Link>
        </h2>
        <p className="place-card__type">{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</p>
      </div>
    </article>
  );
}

export const OfferCardMemo = memo(OfferCard);
