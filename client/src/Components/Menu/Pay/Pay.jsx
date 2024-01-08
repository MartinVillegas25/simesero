import { useEffect, useState } from 'react';
import './Pay.css';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getPlanToMenu } from '../../../redux/actions';

const socket = io();
//const socket = io('https://menu-didactico.up.railway.app/');

export default function Pay() {
	const [nombre, setNombre] = useState('');
	const [payMethod, setPayMethod] = useState('');
	const [payType, setPayType] = useState('');
	const dispatch = useDispatch();
	const handleSetName = (e) => {
		setNombre(e.target.value.toUpperCase());
	};

	const handleSetMethod = (e) => {
		setPayMethod(e.target.value);
	};

	const handleSetPayType = (e) => {
		setPayType(e.target.value);
	};
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);

	const userEmail = searchParams.get('email');
	const mesa = searchParams.get('mesa');

	const payload = () => {
		console.log('emitiendo');
	};

	socket.on('connect', () => {
		console.log('conectado');
	});

	const usuario = {
		email: userEmail,
		mesa: mesa
	};
	// Enviar el pedido de cuenta al dashboard del cliente
	const handleSubmit = () => {
		socket.emit(
			'pedir-cuenta',
			usuario,
			{ nombre: nombre, metodo: payMethod, dividir:payType  },
			payload
		);
	};

	useEffect(() => {
		dispatch(getPlanToMenu(usuario.email));
	}, []);
	const plan = useSelector((state) => state.planToMenu);

	return (
		<div className="pay-container">
			{plan === 'basic' ? (
				<div>Funcionalidad sin acceso</div>
			) : (
				<div>
					<div className="pay-username">
						<label htmlFor="">Indique su nombre para continuar</label>
						<input type="text" value={nombre} onChange={handleSetName} />
					</div>

					<div className="payment-type-container">
						<h2>Seleccione el metodo de pago</h2>
						<select name="payment-type" id="" onClick={handleSetMethod}>
							<option value="-">-</option>
							<option value="efectivo">Efectivo</option>
							<option value="debito">Debito</option>
							<option value="credito">Credito</option>
							<option value="Mercado Pago">Mercado Pago</option>
							<option value="otro">Otro</option>
						</select>

						<h2>Seleccione tipo de pago</h2>
						<select name="payment-type" id="" onClick={handleSetPayType}>
							<option value="-">-</option>
							<option value="dividir">Quiero dividir la cuenta</option>
							<option value="pagar-total">Quiero pagar el total</option>
							<option value="pagar-parte">Quiero pagar una parte</option>
						</select>

						<button className="payment-btn" onClick={handleSubmit}>
							Pedir la cuenta
						</button>
					</div>
				</div>
			)}
		</div>
	);
}