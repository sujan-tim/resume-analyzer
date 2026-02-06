import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title :'Resumemind | Auth' },
    { name : 'description', content: 'log into your account' },

    
])
const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation(); 
    const next=location.search.split('next=')[1] ;
    const navigate=useNavigate();

    

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next); {
            // Redirect to dashboard or show authenticated content
        }
    }, [auth.isAuthenticated]);

  return (
<main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
<div className="gradient-border shadow-lg">
    <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
        <div className="flex flex-col items-center gap-2 text-center">

        <h1> Welcome </h1>
        <h2> Log in to your account to continue </h2>
        
            </div>
            <div> 
                {isLoading?(
                    <button className="auth-button animate-pulse">
                        <p> Signing in...</p>
                    </button>
                ) : (
                    <>
                    {auth.isAuthenticated ?(
                        <button className="auth-button" onClick={auth.signOut}>
                            <p> Log out </p>

                        </button>
                    ) : (
                        <button className="auth-button" onClick={auth.signIn}>
                            <p> Sign in with Puter </p>
                        </button>
                    )}
                    </>
                )}
            </div>
        
        </section>

</div>
</main>
)
}

export default Auth;
