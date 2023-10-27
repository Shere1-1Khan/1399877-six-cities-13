import {memo} from 'react';
import { Offer } from '../../types/offers-types';
import {OfferCardMemo as OfferCard} from '../offer-card/offer-card';
import classNames from 'classnames';

type OffersListProps = {
  offers: Offer[];
  type: 'cities' | 'near-places' | 'favorites';
  onOfferCardHover?: (id: string | undefined) => void;
}

function OffersList({offers, type, onOfferCardHover}: OffersListProps): JSX.Element {
  const offersListClass = classNames({
    'cities__places-list places__list tabs__content': type === 'cities',
    'near-places__list places__list': type === 'near-places',
    'favorites__places': type === 'favorites',
  });

  return (
    <div className={offersListClass}>
      {offers.map((offer) => (<OfferCard type={type} key={offer.id} offer={offer} onOfferCardHover={onOfferCardHover}/>))}
    </div>
  );
}

export const OffersListMemo = memo(OffersList);
