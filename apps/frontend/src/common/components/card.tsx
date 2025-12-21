interface ICardProps {
	children?: React.ReactNode;
	className?: string;
}

export function Card({ children, className }: ICardProps) {
	return (
		<div
			className={`card bg-base-100 shadow-sm ${className}`}
		>
			{children}
		</div>
	);
}

const Body = ({ children, className }: ICardProps) => {
	return (
		<div className={`card-body ${className}`}>
			{children}
		</div>
	);
};

const P = ({ children, className }: ICardProps) => {
	return <p className={`${className}`}>{children}</p>;
};

const Title = ({ children, className }: ICardProps) => {
	return (
		<h2 className={`card-title ${className}`}>
			{children}
		</h2>
	);
};

const Actions = ({ children, className }: ICardProps) => {
	return (
		<div className={`card-actions ${className}`}>
			{children}
		</div>
	);
};

const Button = ({ children, className }: ICardProps) => {
	return (
		<button type="button" className={`btn ${className}`}>
			{children}
		</button>
	);
};

const Figure = ({ children, className }: ICardProps) => {
	return (
		<figure className={`${className}`}>{children}</figure>
	);
};

const Container = ({ children, className }: ICardProps) => {
	return <div className={`${className}`}>{children}</div>;
};

const Badge = ({ children, className }: ICardProps) => {
	return (
		<div className={`badge ${className}`}>{children}</div>
	);
};

Card.Container = Container;
Card.Figure = Figure;
Card.Body = Body;
Card.Title = Title;
Card.P = P;
Card.Actions = Actions;
Card.Button = Button;
Card.Badge = Badge;
