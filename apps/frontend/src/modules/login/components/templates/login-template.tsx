import {
	LoginBanner,
	LoginForm,
} from '@modules/login/components/organisms';
export function LoginTemplate() {
	return (
		<div className="flex gap-4 justify-between items-center p-8 size-full relative">
			<section className="bg-primary rounded-box basis-1/2 h-full hidden lg:flex flex-col justify-between p-8">
				<LoginBanner />
			</section>
			<section className="rounded-box w-full lg:basis-1/2 h-full flex flex-col items-center justify-center relative">
				<LoginForm />
				<p className="text-base-content/30 text-sm absolute bottom-0 left-50%">
					&copy; {new Date().getFullYear()} Copyright. Todos
					los derechos reservados.
				</p>
			</section>
		</div>
	);
}
