const SUPABASE_URL =
    "https://zcknlekzoknadnmaskfd.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_KvroMnSX8ZgJB1Zrzg7a1g_t4yIkscV";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


const form =
    document.getElementById(
        "contactForm"
    );


const message =
    document.getElementById(
        "message"
    );


const button =
    document.getElementById(
        "submitButton"
    );


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* =========================
           SURNOM
        ========================= */

        const nickname =
            document
                .getElementById("nickname")
                .value
                .trim();


        /* =========================
           SEXE
        ========================= */

        const gender =
            document
                .getElementById("gender")
                .value;


        /* =========================
           PAYS
        ========================= */

        const countrySelect =
            document.getElementById(
                "country"
            );


        const countryCode =
            countrySelect.value;


        const selectedCountry =
            countrySelect.options[
                countrySelect.selectedIndex
            ];


        const countryName =
            selectedCountry
                ? selectedCountry.dataset.country
                : "";


        /* =========================
           NUMÉRO
        ========================= */

        let localPhone =
            document
                .getElementById("phone")
                .value
                .replace(/\D/g, "");


        /* =========================
           VÉRIFICATION DES CHAMPS
        ========================= */

        if (
            !nickname ||
            !localPhone ||
            !gender ||
            !countryCode ||
            !countryName
        ) {

            showMessage(
                "Veuillez remplir tous les champs.",
                "error"
            );

            return;
        }


        /* =========================
           CORRECTION DE L'INDICATIF
        =========================

           Exemple :

           Pays : Haïti (+509)
           Numéro entré :
           50936557309

           devient :

           36557309

           Puis le site ajoute +509.
        */

        if (
            countryCode === "509" &&
            localPhone.startsWith("509")
        ) {

            localPhone =
                localPhone.substring(3);

        }


        /* =========================
           NUMÉRO INTERNATIONAL FINAL
        ========================= */

        const phone =
            "+" +
            countryCode +
            localPhone;


        /* =========================
           NOM DU CONTACT
        ========================= */

        let contactName;


        if (
            gender === "garcon"
        ) {

            contactName =
                `🚀🪫${nickname}V8`;

        } else {

            contactName =
                `🌸${nickname}🌸V8`;

        }


        /* =========================
           BOUTON
        ========================= */

        button.disabled = true;

        button.textContent =
            "ENREGISTREMENT...";


        try {

            /* =====================
               INSERTION SUPABASE
            ===================== */

            const {
                error
            } =
                await supabaseClient
                    .from("contacts")
                    .insert([
                        {
                            nickname:
                                nickname,

                            phone:
                                phone,

                            gender:
                                gender,

                            country:
                                countryName,

                            contact_name:
                                contactName
                        }
                    ]);


            /* =====================
               GESTION DES ERREURS
            ===================== */

            if (error) {

                console.error(
                    "ERREUR SUPABASE :",
                    error
                );


                /* =================
                   NUMÉRO DÉJÀ EXISTANT
                ================= */

                if (
                    error.code ===
                    "23505"
                ) {

                    showMessage(
                        "Ce numéro est déjà enregistré dans le Folder.",
                        "error"
                    );

                    return;
                }


                /* =================
                   AUTRE ERREUR
                ================= */

                showMessage(
                    "Une erreur est survenue. Veuillez réessayer.",
                    "error"
                );

                return;
            }


            /* =========================
               SUCCÈS
            ========================= */

            showMessage(
                "Votre numéro a bien été enregistré par ン፝֟☙.✞𝆺꯭𝅥✰🤴🏻𝐏𝐫𝐢𝐧𝐜𝐞🤴🏻⭐️ 𝑮𝑿𝑭⁰¹🌸",
                "success"
            );


            /* =========================
               RESET DU FORMULAIRE
            ========================= */

            form.reset();


            document
                .querySelectorAll(
                    'input[name="genderChoice"]'
                )
                .forEach(
                    input => {
                        input.checked =
                            false;
                    }
                );


        } catch (error) {

            console.error(
                "ERREUR :",
                error
            );


            showMessage(
                "Impossible de contacter le serveur.",
                "error"
            );


        } finally {

            button.disabled =
                false;


            button.textContent =
                "REJOINDRE LE FOLDER";

        }

    }
);


/* =============================
   MESSAGE
============================= */

function showMessage(
    text,
    type
) {

    message.textContent =
        text;


    message.className =
        `message ${type}`;

}