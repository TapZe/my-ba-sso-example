import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Mail, ArrowRight, Home } from "lucide-react";
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
					navigate({ to: "/login" });
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [navigate]);

	return (
		<div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Success Card */}
				<div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
					{/* Header with gradient */}
					<div className="bg-linear-to-r from-purple-600 to-blue-600 p-8 text-center">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
							<CheckCircle2 className="w-12 h-12 text-green-500" />
						</div>
						<h1 className="text-3xl font-bold text-white mb-2">
							Email Verified!
						</h1>
						<p className="text-purple-100">
							Your email has been successfully verified
						</p>
					</div>

					{/* Content */}
					<div className="p-8">
						<div className="flex items-start gap-4 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
							<Mail className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
							<div>
								<h3 className="font-semibold text-green-900 mb-1">
									All Set!
								</h3>
								<p className="text-sm text-green-700">
									You can now access all features of your account. Welcome
									aboard!
								</p>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3">
							<button
								type="button"
								onClick={() => navigate({ to: "/login" })}
								className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
							>
								Continue to Login
								<ArrowRight className="w-5 h-5" />
							</button>

							<button
								type="button"
								onClick={() => navigate({ to: "/" })}
								className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
							>
								<Home className="w-5 h-5" />
								Go to Home
							</button>
						</div>

						{/* Auto redirect notice */}
						<div className="mt-6 text-center">
							<p className="text-sm text-gray-500">
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
					<p className="text-sm text-gray-600">
						Need help?{" "}
						<a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
							Contact Support
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
