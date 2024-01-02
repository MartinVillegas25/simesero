import { IoNotifications } from 'react-icons/io5';
import { RxTriangleDown } from 'react-icons/rx';
import './ClientProfile.css';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalData } from '../../../redux/actions';

// eslint-disable-next-line react/prop-types
export default function ClientProfile() {
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const userEmail = searchParams.get('email');
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getLocalData(userEmail));
	}, []);
	const dataLocal = useSelector((state) => state.localData.usuario);

	return (
		<nav className="client-menu">
			<div className="client-menu-container">
				<div className="client-menu-panel">
					<IoNotifications className="client-menu-notification" />
					<img src={dataLocal?.img} alt="" className="client-menu-img" />
					<div>
						<div>
							<h3>Mi cuenta</h3>
							<button className="arrow-menu" onClick={handleClick}>
								<RxTriangleDown />
							</button>
						</div>
						<div className={`${open ? 'panel-open' : 'panel-closed'}`}>
							<a href={`/dashboard/configuracion?email=${userEmail}`}>
								Mi perfil
							</a>
							<a href="/">Cerrar sesion</a>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
