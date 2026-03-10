import "@/styles/global.css";
export default function RootLayout({children}){
    return(
        <>
        <html>
            <title>Royal Assets</title>
            <body>{children}</body>
        </html>
        </>
    )
}