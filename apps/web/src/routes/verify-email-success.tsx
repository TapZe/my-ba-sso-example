import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Home, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/verify-email-success")({
	component: VerifyEmailSuccess,
});

function VerifyEmailSuccess() {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		// Countdown timer
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					navigate({ to: "/dashboard" });
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [navigate]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-50 via-white to-blue-50 p-4">
			<div className="w-full max-w-md">
				{/* Success Card */}
				<div className="transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 hover:scale-[1.02]">
					{/* Header with gradient */}
					<div className="bg-linear-to-r from-purple-600 to-blue-600 p-8 text-center">
						<div className="mb-4 inline-flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-white">
							<CheckCircle2 className="h-12 w-12 text-green-500" />
						</div>
						<h1 className="mb-2 font-bold text-3xl text-white">
							Email Verified!
						</h1>
						<p className="text-purple-100">
							Your email has been successfully verified
						</p>
					</div>

					{/* Content */}
					<div className="p-8">
						<div className="mb-6 flex items-start gap-4 rounded-lg border border-green-200 bg-green-50 p-4">
							<Mail className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />
							<div>
								<h3 className="mb-1 font-semibold text-green-900">All Set!</h3>
								<p className="text-green-700 text-sm">
									You can now access all features of your account. Welcome
									aboard!
								</p>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3">
							<button
								type="button"
								onClick={() => navigate({ to: "/dashboard" })}
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
							>
								Continue to Dashboard
								<ArrowRight className="h-5 w-5" />
							</button>

							<button
								type="button"
								onClick={() => navigate({ to: "/" })}
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
							>
								<Home className="h-5 w-5" />
								Go to Home
							</button>
						</div>

						{/* Auto redirect notice */}
						<div className="mt-6 text-center">
							<p className="text-gray-500 text-sm">
								Automatically redirecting to login in{" "}
								<span className="font-semibold text-purple-600">
									{countdown}
								</span>{" "}
								seconds...
							</p>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="mt-6 text-center">
					<p className="text-gray-600 text-sm">
						Need help?{" "}
						<a
							href="#"
							className="font-medium text-purple-600 hover:text-purple-700"
						>
							Contact Support
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
