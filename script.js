/* =====================================================
   XENMARK MEDIA + MOBILE MOTION
   Keep the visual experience on mobile. Heavy full-screen effects
   are reduced in CSS, but functional animations/timers stay active.
===================================================== */
document.addEventListener("DOMContentLoaded", function(){
    fetch("data.json")
        .then(function(response){
            if(!response.ok) throw new Error("data.json failed: " + response.status);
            return response.json();
        })
        .then(function(data){
            const media = document.querySelectorAll("[data-json-src]");

            function reserveMediaSpace(el){
                if(el.tagName !== "IMG") return;
                if(el.dataset.layoutReserved === "1") return;
                el.dataset.layoutReserved = "1";
                const parent = el.parentElement;
                if(parent && !parent.style.minHeight && !parent.classList.contains("card-frame")){
                    const rect = parent.getBoundingClientRect();
                    if(rect.height > 20) return;
                }
            }

            function loadMedia(el){
                reserveMediaSpace(el);
                const key = el.getAttribute("data-json-src");
                if(!data[key]) return;
                if(el.tagName === "SOURCE") {
                    el.src = data[key];
                    const video = el.closest("video");
                    if(video) video.load();
                } else {
                    el.src = data[key];
                    el.decoding = "async";
                }
            }

            const lazyObserver = "IntersectionObserver" in window ? new IntersectionObserver(function(entries, obs){
                entries.forEach(function(entry){
                    if(entry.isIntersecting){
                        loadMedia(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, {rootMargin:"350px 0px"}) : null;

            media.forEach(function(el){
                const isHeroVideoSource = el.tagName === "SOURCE" && el.closest(".hero-video");
                const isHeroImage = !!el.closest(".hero");

                // Hero media is loaded immediately; other images are lazy-loaded near the viewport.
                if(isHeroVideoSource || isHeroImage || !lazyObserver){
                    loadMedia(el);
                } else if(el.tagName !== "SOURCE") {
                    lazyObserver.observe(el);
                } else {
                    loadMedia(el);
                }
            });

            const video = document.querySelector(".hero-video");
            if(video){
                video.muted = true;
                video.setAttribute("muted", "");
                video.setAttribute("playsinline", "");
                video.setAttribute("autoplay", "");
                video.setAttribute("loop", "");
                video.preload = "metadata";

                function tryPlay(){
                    const p = video.play();
                    if(p && typeof p.catch === "function") p.catch(function(){});
                }
                video.addEventListener("loadeddata", tryPlay, {once:true});
                video.addEventListener("canplay", tryPlay, {once:true});
                setTimeout(tryPlay, 700);

                // If the remote video fails, use a known Coverr fallback rather than leaving a dead hero.
                video.addEventListener("error", function(){
                    if(video.dataset.fallbackApplied === "1") return;
                    video.dataset.fallbackApplied = "1";
                    const source = video.querySelector("source");
                    if(source){
                        source.src = "https://cdn.coverr.co/videos/coverr-overhead-view-of-the-highway-8903/1080p.mp4";
                        video.load();
                        tryPlay();
                    }
                }, {once:true});
            }
        })
        .catch(function(err){ console.error("Xenmark media error:", err); });
});

/* =====================================================
   LOADER
===================================================== */

window.addEventListener(
    "load",
    function(){

        setTimeout(
            function(){

                document
                .getElementById("loader")
                .classList
                .add("hide");

            },
            2200
        );

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

const menu =
document.getElementById("menu");


const nav =
document.getElementById("nav");


menu.addEventListener(
    "click",
    function(){

        nav.classList.toggle("show");

    }
);


document
.querySelectorAll("#nav a")
.forEach(
    function(link){

        link.addEventListener(
            "click",
            function(){

                nav.classList.remove("show");

            }
        );

    }
);


/* =====================================================
   SCROLL PROGRESS
===================================================== */

const progress =
document.getElementById("scrollProgress");


let progressTick = false;
window.addEventListener("scroll", function(){
    if(progressTick) return;
    progressTick = true;
    window.requestAnimationFrame(function(){
        const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const percent = Math.max(0, Math.min(100, (window.scrollY / total) * 100));
        if(progress) progress.style.transform = "scaleX(" + (percent / 100) + ")";
        progressTick = false;
    });
}, {passive:true});


/* =====================================================
   CURSOR GLOW
===================================================== */

const glow =
document.getElementById("cursorGlow");


document.addEventListener(
    "mousemove",
    function(e){

        if(window.innerWidth <= 700){

            return;

        }


        glow.style.left =
            e.clientX + "px";


        glow.style.top =
            e.clientY + "px";

    }
);


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealObserver =
new IntersectionObserver(
    function(entries){

        entries.forEach(
            function(entry){

                if(entry.isIntersecting){

                    entry.target.classList.add("reveal-active");
                    entry.target.classList.add("show");
                    window.setTimeout(function(){
                        entry.target.classList.remove("reveal-active");
                    }, 800);


                    revealObserver
                    .unobserve(
                        entry.target
                    );

                }

            }
        );

    },
    {
        threshold:.12
    }
);


document
.querySelectorAll(".reveal")
.forEach(
    function(element){

        revealObserver.observe(element);

    }
);


/* =====================================================
   HERO SLOGANS
===================================================== */

const heroSlogans = [

    "MAKE YOUR SIGNAL",
    "WEAR YOUR VISION",
    "BUILD YOUR IDENTITY",
    "CREATE WHAT YOU SEE",
    "DON'T FOLLOW THE STANDARD",
    "MAKE IT COMPLETELY YOURS"

];


let heroIndex = 0;


setInterval(
    function(){

        const element =
            document.getElementById("heroSlogan");


        heroIndex++;


        if(heroIndex >= heroSlogans.length){

            heroIndex = 0;

        }


        element.style.opacity =
            "0";


        setTimeout(
            function(){

                element.innerHTML =

                    `<div class="hero-slogan-inner">
                        ${heroSlogans[heroIndex]}
                    </div>`;


                element.style.opacity =
                    "1";

            },
            250
        );


    },
    3000
);


/* =====================================================
   SECTION SLOGANS
===================================================== */

document
.querySelectorAll(".dynamic-slogan")
.forEach(
    function(element){

        const slogans =

            element
            .dataset
            .slogans
            .split("|")
            .map(
                function(item){

                    return item.trim();

                }
            );


        let index = 0;


        setInterval(
            function(){

                index++;


                if(index >= slogans.length){

                    index = 0;

                }


                element.style.opacity =
                    "0";


                setTimeout(
                    function(){

                        element.textContent =
                            slogans[index];


                        element.classList.remove("slogan-refresh");
                        requestAnimationFrame(function(){
                            element.classList.add("slogan-refresh");
                        });


                    },
                    250
                );


            },
            3000
        );

    }
);


/* =====================================================
   AUTO IMAGE CHANGE EVERY 3 SECONDS
===================================================== */

document
.querySelectorAll(".auto-image")
.forEach(
    function(image){

        const source =
            image.dataset.images;


        if(!source){

            return;

        }


        const images =
            source
            .split("|")
            .map(
                function(item){

                    return item.trim();

                }
            );


        let index = 0;


        setInterval(
            function(){

                index++;


                if(index >= images.length){

                    index = 0;

                }


                image.style.opacity =
                    "0";


                setTimeout(
                    function(){

                        image.src =
                            images[index];


                        image.style.opacity =
                            "1";

                    },
                    250
                );


            },
            3000
        );


    }
);


/* =====================================================
   BANNER
===================================================== */

const bannerSlides =
document.querySelectorAll(".banner-slide");


const bannerDots =
document.querySelectorAll(".banner-dot");


let bannerIndex = 0;


function changeBanner(index){

    bannerIndex = index;


    bannerSlides.forEach(
        function(slide){

            slide.classList.remove("active");

        }
    );


    bannerDots.forEach(
        function(dot){

            dot.classList.remove("active");

        }
    );


    bannerSlides[index]
        .classList
        .add("active");


    bannerDots[index]
        .classList
        .add("active");

}


setInterval(
    function(){

        bannerIndex++;


        if(bannerIndex >= bannerSlides.length){

            bannerIndex = 0;

        }


        changeBanner(bannerIndex);

    },
    5000
);


/* =====================================================
   CRAZY DROP
===================================================== */

const crazyStage =
document.getElementById("crazyStage");


if(crazyStage){

    const crazyObserver =

        new IntersectionObserver(
            function(entries){

                entries.forEach(
                    function(entry){

                        if(entry.isIntersecting){

                            crazyStage
                            .classList
                            .add("active");


                            crazyObserver
                            .unobserve(
                                crazyStage
                            );

                        }

                    }
                );

            },
            {
                threshold:.18
            }
        );


    crazyObserver.observe(crazyStage);

}


/* =====================================================
   CUSTOMIZER
===================================================== */

document
.querySelectorAll(".options")
.forEach(
    function(group){

        const buttons =
            group.querySelectorAll(".option");


        buttons.forEach(
            function(button){

                button.addEventListener(
                    "click",
                    function(){

                        buttons.forEach(
                            function(item){

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

    }
);


/* =====================================================
   FAQ
===================================================== */

document
.querySelectorAll(".faq-question")
.forEach(
    function(button){

        button.addEventListener(
            "click",
            function(){

                const item =
                    button.parentElement;


                document
                .querySelectorAll(".faq-item")
                .forEach(
                    function(other){

                        if(other !== item){

                            other.classList.remove(
                                "active"
                            );

                        }

                    }
                );


                item.classList.toggle(
                    "active"
                );

            }
        );

    }
);


/* =====================================================
   CONTACT
===================================================== */

function openContact(){

    document
    .getElementById("contactPopup")
    .classList
    .add("show");

}


function closeContact(){

    document
    .getElementById("contactPopup")
    .classList
    .remove("show");

}


document
.getElementById("contactPopup")
.addEventListener(
    "click",
    function(e){

        if(e.target === this){

            closeContact();

        }

    }
);


document.addEventListener(
    "keydown",
    function(e){

        if(e.key === "Escape"){

            closeContact();

        }

    }
);


/* =====================================================
   WHATSAPP FORM
===================================================== */

document
.getElementById("quoteForm")
.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const phone =
            document.getElementById("phone").value;

        const product =
            document.getElementById("product").value;

        const type =
            document.getElementById("type").value;

        const message =
            document.getElementById("message").value;

        const text =
`XENMARK ENQUIRY

Name: ${name}
Email: ${email}
Phone: ${phone}
Product: ${product}
Customization: ${type}

Tell us about design:
${message}`;

        const whatsappURL =
            "https://wa.me/919876543210?text=" +
            encodeURIComponent(text);

        window.open(
            whatsappURL,
            "_blank"
        );

    }
);

/* =====================================================
   TOP BUTTON
===================================================== */

const topBtn =
document.getElementById("topBtn");


window.addEventListener(
    "scroll",
    function(){

        if(window.scrollY > 600){

            topBtn.classList.add("show");

        }else{

            topBtn.classList.remove("show");

        }

    }
);


topBtn.addEventListener(
    "click",
    function(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }
);


/* =====================================================
   YEAR
===================================================== */

document
.getElementById("year")
.innerText =
new Date().getFullYear();


/* =====================================================
   WEAPON SELECTION
===================================================== */

(function(){

    const choices =
        document.querySelectorAll(
            ".arsenal-choice"
        );

    const image =
        document.getElementById(
            "arsenalImage"
        );

    const number =
        document.getElementById(
            "arsenalNumber"
        );

    const meta =
        document.getElementById(
            "arsenalMeta"
        );

    const title =
        document.getElementById(
            "arsenalTitle"
        );

    const description =
        document.getElementById(
            "arsenalText"
        );

    const product =
        document.querySelector(
            ".arsenal-product"
        );

    if(
        !choices.length ||
        !image ||
        !product
    ){
        return;
    }


    const products = [

        {
            number:"01",
            meta:"CORE DROP / 001",
            title:"OVERSIZED TEE",
            text:
                "Heavy visual presence with a clean custom finish.",
            image:
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=90"
        },

        {
            number:"02",
            meta:"HEAVY WEIGHT / 002",
            title:"CYBER HOODIE",
            text:
                "A bold streetwear silhouette built for custom graphics.",
            image:
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=90"
        },

        {
            number:"03",
            meta:"ACCESSORY / 003",
            title:"STREET CAP",
            text:
                "Minimal profile with maximum identity.",
            image:
                "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=90"
        },

        {
            number:"04",
            meta:"CUSTOM SPORT / 004",
            title:"TEAM JERSEY",
            text:
                "Custom sportswear engineered for teams and events.",
            image:
                "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=90"
        },

        {
            number:"05",
            meta:"LIMITED / 005",
            title:"PRINTED HOODIE",
            text:
                "Statement graphics with a premium finish.",
            image:
                "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=1200&q=90"
        }

    ];


    function activateProduct(index){

        const item =
            products[index];

        choices.forEach(
            function(button,i){

                button.classList.toggle(
                    "active",
                    i === index
                );

            }
        );


        product.classList.remove(
            "active"
        );

        image.style.opacity = "0";

        image.style.transform =
            "scale(.88) translateY(25px)";


        setTimeout(
            function(){

                image.src =
                    item.image;

                number.textContent =
                    item.number;

                meta.textContent =
                    item.meta;

                title.textContent =
                    item.title;

                description.textContent =
                    item.text;


                product.classList.add(
                    "active"
                );

                image.style.opacity = "1";

                image.style.transform =
                    "scale(1) translateY(0)";

            },
            180
        );

    }


    choices.forEach(
        function(button,index){

            button.addEventListener(
                "click",
                function(){

                    activateProduct(
                        index
                    );

                }
            );

        }
    );


    let started = false;

    const section =
        document.getElementById(
            "arsenal"
        );


    if(section){

        const observer =
            new IntersectionObserver(
                function(entries){

                    entries.forEach(
                        function(entry){

                            if(
                                entry.isIntersecting &&
                                !started
                            ){

                                started = true;

                                let index = 0;


                                const timer =
                                    setInterval(
                                        function(){

                                            index++;


                                            if(
                                                index >=
                                                products.length
                                            ){

                                                clearInterval(
                                                    timer
                                                );

                                                return;
                                            }


                                            activateProduct(
                                                index
                                            );

                                        },
                                        1600
                                    );

                            }

                        }
                    );

                },
                {
                    threshold:.3
                }
            );


        observer.observe(
            section
        );

    }

})();


/* =====================================================
   CUSTOMIZER IMAGE SELECTION
===================================================== */

(function(){

    const preview =
        document.getElementById("customizerPreview");

    const options =
        document.querySelectorAll(".customizer .option");

    if(!preview || !options.length){
        return;
    }

    const apparelImages = {
        "T-SHIRT":"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1300&q=90",
        "HOODIE":"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1300&q=90",
        "JERSEY":"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1300&q=90",
        "CAP":"https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1300&q=90"
    };

    const treatmentImages = {
        "DTF":"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1300&q=90",
        "EMBROIDERY":"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1300&q=90",
        "BOTH":"https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1300&q=90"
    };

    function showImage(url){
        preview.style.opacity = "0";
        preview.style.transform = "scale(.94)";

        setTimeout(function(){
            preview.src = url;
            preview.style.opacity = "1";
            preview.style.transform = "scale(1)";
        },180);
    }

    options.forEach(function(button){

        button.addEventListener("click",function(){

            const value =
                button.textContent
                .trim()
                .toUpperCase();

            const group =
                button.parentElement;

            group
            .querySelectorAll(".option")
            .forEach(function(item){
                item.classList.remove("active");
            });

            button.classList.add("active");

            if(apparelImages[value]){
                showImage(apparelImages[value]);
            }

            if(treatmentImages[value]){
                showImage(treatmentImages[value]);
            }

        });

    });

    document
    .querySelectorAll("[data-nav-treatment]")
    .forEach(function(link){

        link.addEventListener("click",function(){

            const wanted =
                link.dataset.navTreatment;

            options.forEach(function(button){

                if(
                    button.textContent
                    .trim()
                    .toUpperCase() === wanted
                ){
                    button.click();
                }

            });

        });

    });

})();


/* =====================================================
   LIMITED DROP COUNTDOWN
===================================================== */

(function(){

    const days =
        document.getElementById(
            "limitedDays"
        );

    const hours =
        document.getElementById(
            "limitedHours"
        );

    const minutes =
        document.getElementById(
            "limitedMinutes"
        );

    const seconds =
        document.getElementById(
            "limitedSeconds"
        );


    if(
        !days ||
        !hours ||
        !minutes ||
        !seconds
    ){
        return;
    }


    /*
       CHANGE THIS DATE TO YOUR ACTUAL DROP DATE.
    */

    const dropDate =
        new Date(
            "2026-12-31T23:59:59"
        ).getTime();


    function updateLimitedDrop(){

        const now =
            new Date().getTime();

        let distance =
            dropDate - now;


        if(
            distance < 0
        ){

            distance = 0;

        }


        const dayValue =
            Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );


        const hourValue =
            Math.floor(
                (
                    distance %
                    (1000 * 60 * 60 * 24)
                )
                /
                (1000 * 60 * 60)
            );


        const minuteValue =
            Math.floor(
                (
                    distance %
                    (1000 * 60 * 60)
                )
                /
                (1000 * 60)
            );


        const secondValue =
            Math.floor(
                (
                    distance %
                    (1000 * 60)
                )
                /
                1000
            );


        days.textContent =
            String(
                dayValue
            ).padStart(
                2,
                "0"
            );


        hours.textContent =
            String(
                hourValue
            ).padStart(
                2,
                "0"
            );


        minutes.textContent =
            String(
                minuteValue
            ).padStart(
                2,
                "0"
            );


        seconds.textContent =
            String(
                secondValue
            ).padStart(
                2,
                "0"
            );

    }


    updateLimitedDrop();

    setInterval(
        updateLimitedDrop,
        1000
    );

})();


/* =====================================================
   CRAZY CYBERPUNK BANNER — AUTO CHANGE EVERY 3 SECONDS
===================================================== */

(function(){

    const slides = document.querySelectorAll('.crazy-banner-slide');
    const dots = document.querySelectorAll('.crazy-banner-dot');

    if(!slides.length){
        return;
    }

    let crazyBannerIndex = 0;
    let crazyBannerTimer = null;
    let changing = false;

    function changeCrazyBanner(index){

        if(changing || index === crazyBannerIndex){
            return;
        }

        changing = true;

        const current = slides[crazyBannerIndex];
        const next = slides[index];

        if(current){
            current.classList.add('cyber-exit');
            current.classList.remove('active');
        }

        /* Tiny delay makes the cyberpunk wipe/glitch feel cleaner. */
        window.setTimeout(function(){

            slides.forEach(function(slide){
                slide.classList.remove('active');
            });

            dots.forEach(function(dot){
                dot.classList.remove('active');
            });

            slides.forEach(function(slide){
                slide.classList.remove('cyber-exit');
            });

            next.classList.add('active');

            if(dots[index]){
                dots[index].classList.add('active');
            }

            crazyBannerIndex = index;
            changing = false;

        },180);
    }

    function nextCrazyBanner(){
        const nextIndex = (crazyBannerIndex + 1) % slides.length;
        changeCrazyBanner(nextIndex);
    }

    function restartCrazyBannerTimer(){
        window.clearInterval(crazyBannerTimer);
        crazyBannerTimer = window.setInterval(nextCrazyBanner,3000);
    }

    dots.forEach(function(dot){

        dot.addEventListener('click',function(){

            const index = Number(dot.dataset.crazyBanner);

            if(Number.isInteger(index) && index >= 0 && index < slides.length){
                changeCrazyBanner(index);
                restartCrazyBannerTimer();
            }

        });

    });

    /* Pause on hover so the image/text can be read, then continue automatically. */
    const banner = document.querySelector('#crazy-banner .crazy-banner-wrap');

    if(banner){
        banner.addEventListener('mouseenter',function(){
            window.clearInterval(crazyBannerTimer);
        });

        banner.addEventListener('mouseleave',function(){
            restartCrazyBannerTimer();
        });
    }

    restartCrazyBannerTimer();

})();



/* =====================================================
   ENHANCED XENMARK EXPERIENCE JS
===================================================== */

/* Scroll reveal for the new premium sections + selected major blocks. */
(function(){
    const items = document.querySelectorAll(
        '.scroll-reveal, .visual-section, .section-head, #collection .banner, .crazy-stage'
    );

    if(!items.length){
        return;
    }

    items.forEach(function(item){
        item.classList.add('scroll-reveal');
    });

    const observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible');
                entry.target.classList.add('reveal-active');
                window.setTimeout(function(){
                    entry.target.classList.remove('reveal-active');
                }, 800);
                observer.unobserve(entry.target);
            }
        });
    },{threshold:.12});

    items.forEach(function(item){
        observer.observe(item);
    });
})();

/* Animated words inside ENTER THE CRAZY. */
(function(){
    const element = document.querySelector('.crazy-live-word');

    if(!element){
        return;
    }

    const words = element.dataset.words
        .split('|')
        .map(function(word){ return word.trim(); })
        .filter(Boolean);

    if(!words.length){
        return;
    }

    let index = 0;

    window.setInterval(function(){
        element.classList.remove('is-changing');
        void element.offsetWidth;
        element.classList.add('is-changing');

        window.setTimeout(function(){
            index = (index + 1) % words.length;
            element.textContent = words[index];
        },220);
    },2800);
})();

/* Auto-highlight the extra crazy collection every 3 seconds. */
(function(){
    const cards = document.querySelectorAll('.crazy-collection-card');
    const status = document.getElementById('crazyCollectionStatus');

    if(!cards.length){
        return;
    }

    let index = 0;

    function activate(next){
        index = next;

        cards.forEach(function(card, cardIndex){
            card.classList.toggle('active', cardIndex === index);
        });

        if(status){
            status.textContent = String(index + 1).padStart(2,'0') + ' / ' + String(cards.length).padStart(2,'0');
        }
    }

    activate(0);

    window.setInterval(function(){
        activate((index + 1) % cards.length);
    },3000);
})();

/* Cyberpunk loading transition. */
(function(){
    const loader = document.getElementById('xenmarkLoader');
    const bar = loader ? loader.querySelector('.xenmark-loader-progress span') : null;
    const percent = document.getElementById('xenmarkLoaderPercent');

    if(!loader){
        return;
    }

    let value = 0;
    let loaded = false;

    function renderProgress(number){
        const safe = Math.min(100,Math.max(0,number));

        if(bar){
            bar.style.width = safe + '%';
        }

        if(percent){
            percent.textContent = String(Math.round(safe)).padStart(2,'0') + '%';
        }
    }

    const progressTimer = window.setInterval(function(){
        value += value < 70 ? 4 : 2;

        if(value >= 96){
            value = 96;
            window.clearInterval(progressTimer);
        }

        renderProgress(value);
    },80);

    function finishLoader(){
        if(loaded){
            return;
        }

        loaded = true;
        window.clearInterval(progressTimer);
        renderProgress(100);

        window.setTimeout(function(){
            loader.classList.add('loader-hide');

            window.setTimeout(function(){
                if(loader.parentNode){
                    loader.parentNode.removeChild(loader);
                }
            },800);
        },260);
    }

    if(document.readyState === 'complete'){
        window.setTimeout(finishLoader,350);
    }else{
        window.addEventListener('load',function(){
            window.setTimeout(finishLoader,350);
        },{once:true});
    }

    /* Safety fallback for slow/blocked external assets. */
    window.setTimeout(finishLoader,2600);
})();
