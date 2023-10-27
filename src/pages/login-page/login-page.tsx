import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Helmet} from 'react-helmet-async';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {AppRoute, AuthorizationStatus, CityMap} from '../../const';
import {getRandomCity} from '../../utils/utils';
import {setActiveCity} from '../../store/offers-data/offers-data.slice';
import {getAuthorizationStatus} from '../../store/user-data/user-data.selectors';
import Header from '../../components/header/header';
import LoginForm from '../../components/login-form/login-form';

function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthorizationStatus = useAppSelector(getAuthorizationStatus);

  const randomCity = getRandomCity(CityMap);

  const handleButtonRandomClick = () => {
    dispatch(setActiveCity(randomCity));
    navigate(AppRoute.Main);
  };

  useEffect(() => {
    if (isAuthorizationStatus === AuthorizationStatus.Auth) {
      navigate(AppRoute.Main);
    }
  }, [isAuthorizationStatus, navigate]);

  return (
    <div className="page page--gray page--login">
      <Helmet>
        <title>6 cities: Login</title>
      </Helmet>
      <Header isLogin/>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <LoginForm/>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <button className="locations__item-link" type='button' onClick={handleButtonRandomClick} style={{ border: 'none' }}>
                <span>{randomCity.name}</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
