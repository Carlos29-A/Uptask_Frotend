export const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
    return (
        <p className="text-xs text-red-600 font-medium mt-1">
            {children}
        </p>
    );
};
