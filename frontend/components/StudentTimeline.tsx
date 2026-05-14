export default function StudentTimeline({ status }) {
    const steps = [
        "PENDING",
        "APPROVED",
        "PAYMENT_PENDING",
        "PAID",
        "PREPARING",
        "SUBMITTED",
        "VISA_GRANTED",
        "ENROLLED",
    ];

    const getIndex = (s) => steps.indexOf(s);
    const current = getIndex(status);

    return (
        <div className="flex items-center gap-2 text-xs">
            {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">

                    <div
                        className={`w-4 h-4 rounded-full ${i <= current ? "bg-green-500" : "bg-gray-300"
                            }`}
                    />

                    {i < steps.length - 1 && (
                        <div
                            className={`w-10 h-1 ${i < current ? "bg-green-500" : "bg-gray-300"
                                }`}
                        />
                    )}

                </div>
            ))}
        </div>
    );
}