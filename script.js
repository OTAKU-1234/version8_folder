const SUPABASE_URL = "https://zcknlekzoknadnmaskfd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_KvroMnSX8ZgJB1Zrzg7a1g_t4yIkscV";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


const form = document.getElementById("contactForm");

const message = document.getElementById("message");

const button = document.getElementById("submitButton");


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    const nickname =
        document.getElementById("nickname").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const gender =
        document.getElementById("gender").value;

    const country =
        document.getElementById("country").value.trim();


    if (!nickname || !phone || !gender || !country) {

        showMessage(
            "Veuillez remplir tous les champs.",
            "error"
        );

        return;
    }


    button.disabled = true;

    button.textContent = "ENREGISTREMENT...";


    let contactName;


    if (gender === "garcon") {

        contactName = `🚀🪫${nickname}V8`;

    } else {

        contactName = `🌸${nickname}🌸V8`;

    }


    try {

        const { error } = await supabaseClient
            .from("contacts")
            .insert([
                {
                    nickname: nickname,
                    phone: phone,
                    gender: gender,
                    country: country,
                    contact_name: contactName
                }
            ]);


        if (error) {

            console.error(error);

            showMessage(
                "Une erreur est survenue. Veuillez réessayer.",
                "error"
            );

            return;
        }


        showMessage(
            `Votre numéro a bien été enregistré par ン፝֟☙.✞𝆺꯭𝅥✰🤴🏻𝐏𝐫𝐢𝐧𝐜𝐞🤴🏻⭐️ 𝑮𝑿𝑭⁰¹🌸`,
            "success"
        );


        form.reset();


    } catch (error) {

        console.error(error);

        showMessage(
            "Impossible de contacter le serveur.",
            "error"
        );

    } finally {

        button.disabled = false;

        button.textContent = "REJOINDRE LE FOLDER";

    }

});


function showMessage(text, type) {

    message.textContent = text;

    message.className = `message ${type}`;

          }
