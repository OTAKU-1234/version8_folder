const SUPABASE_URL =
    "https://zcknlekzoknadnmaskfd.supabase.co";


const SUPABASE_ANON_KEY =
    "sb_publishable_KvroMnSX8ZgJB1Zrzg7a1g_t4yIkscV";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


let contacts = [];


const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginCard =
    document.getElementById(
        "loginCard"
    );


const adminPanel =
    document.getElementById(
        "adminPanel"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const contactsList =
    document.getElementById(
        "contactsList"
    );


const contactCount =
    document.getElementById(
        "contactCount"
    );


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const {
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email,
                    password
                });


        if (error) {

            loginMessage.textContent =
                "Email ou mot de passe incorrect.";

            loginMessage.className =
                "message error";

            return;
        }


        showAdmin();

    }
);


/* =========================
   SESSION
========================= */

async function checkSession() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (session) {

        showAdmin();

    }

}


checkSession();


/* =========================
   ADMIN
========================= */

function showAdmin() {

    loginCard.style.display =
        "none";

    adminPanel.style.display =
        "block";

    loadContacts();

}


/* =========================
   CONTACTS
========================= */

async function loadContacts() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("contacts")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        contactCount.textContent =
            "Erreur de chargement.";

        return;

    }


    contacts =
        data || [];


    contactCount.textContent =
        `${contacts.length} contact(s) enregistré(s)`;


    contactsList.innerHTML =
        "";


    if (
        contacts.length === 0
    ) {

        contactsList.innerHTML = `

            <div
                style="
                    text-align:center;
                    color:#555;
                    padding:25px;
                "
            >
                Aucun contact enregistré.
            </div>

        `;

        return;

    }


    contacts.forEach(
        contact => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "contact-item";


            item.innerHTML = `

                <div class="contact-name">

                    ${escapeHTML(
                        contact.contact_name
                    )}

                </div>


                <div class="contact-phone">

                    ${escapeHTML(
                        contact.phone
                    )}

                </div>


                <div class="contact-info">

                    ${escapeHTML(
                        contact.country
                    )}

                    ·

                    ${
                        contact.gender ===
                        "garcon"
                        ? "Garçon"
                        : "Fille"
                    }

                </div>

            `;


            contactsList.appendChild(
                item
            );

        }
    );

}


/* =========================
   VCF
========================= */

document
    .getElementById(
        "downloadVCF"
    )
    .addEventListener(
        "click",
        function () {

            if (
                contacts.length === 0
            ) {

                alert(
                    "Aucun contact à exporter."
                );

                return;

            }


            let vcf = "";


            contacts.forEach(
                contact => {

                    const name =
                        escapeVCF(
                            contact.contact_name
                        );


                    const phone =
                        escapeVCF(
                            contact.phone
                        );


                    vcf +=
`BEGIN:VCARD
VERSION:3.0
FN:${name}
N:${name};;;;
TEL;TYPE=CELL:${phone}
END:VCARD
`;

                }
            );


            const blob =
                new Blob(
                    [vcf],
                    {
                        type:
                            "text/vcard;charset=utf-8"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "Prince Folder V8.vcf";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );

        }
    );


/* =========================
   LOGOUT
========================= */

document
    .getElementById(
        "logoutButton"
    )
    .addEventListener(
        "click",
        async function () {

            await supabaseClient
                .auth
                .signOut();


            location.reload();

        }
    );


/* =========================
   SECURITY
========================= */

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeVCF(
    value
) {

    return String(value)

        .replaceAll(
            "\\",
            "\\\\"
        )

        .replaceAll(
            "\n",
            "\\n"
        )

        .replaceAll(
            ";",
            "\\;"
        )

        .replaceAll(
            ",",
            "\\,"
        );

}
