"use client"

export default function Footer() {
    return (
        <footer className="py-8 border-t border-border bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Global Air Quality Monitor. All rights reserved.</p>
                <p className="mt-2">
                    View the project on <a href="https://github.com/srios000/urban-air-quality-prediction" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline dark:text-sky-400">GitHub</a>.
                </p>
            </div>
        </footer>
    );
}