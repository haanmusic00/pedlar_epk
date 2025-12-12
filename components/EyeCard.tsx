import { Play, Square, Pause, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const coverImage = "/file/imgs/love_and_patience.webp";
const bioImage = "/file/imgs/bio_profile.webp";

type CardType = "main" | "bio" | "info" | "discography";

function Monster() {
  const [page, setPage] = useState<"image" | "lyrics">("image");
  const [lyrics, setLyrics] = useState<string>("");

  useEffect(() => {
    fetch("/file/lyrics/love and patience.txt")
      .then((res) => res.text())
      .then((text) => setLyrics(text))
      .catch((err) => console.error("Failed to load lyrics:", err));
  }, []);

  const handleClick = () => {
    if (page === "image") {
      setPage("lyrics");
    } else {
      setPage("image");
    }
  };

  return (
    <div
      className="bg-[var(--cookie-monster-blue)] relative shrink-0 aspect-square w-full overflow-hidden cursor-pointer"
      data-name
      ="monster"
      onClick={handleClick}
    >
      {page === "image" && (
        <img
          src={coverImage}
          alt="Love and Patience"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.warn('Image failed to load:', coverImage);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      {page === "lyrics" && (
        <div
          className="absolute inset-0 p-6 overflow-y-auto pointer-events-auto"
          style={{ 
            backgroundColor: "#e8dcc4",
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="text-black whitespace-pre-line text-base sm:text-lg leading-relaxed">
            {lyrics || "Loading lyrics..."}
          </div>
        </div>
      )}
    </div>
  );
}

function Hero() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [_isPlaying, setIsPlaying] = useState(false);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let audioElement: HTMLAudioElement | null = null;
    let isMounted = true;
    
    try {
      audioElement = new Audio('/file/mp3s/Love and Patience_full.mp3');
      
      const handleLoadedMetadata = () => {
        if (isMounted && audioElement && audioElement.duration && isFinite(audioElement.duration)) {
          setDuration(audioElement.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (isMounted && audioElement) {
          setCurrentTime(audioElement.currentTime);
        }
      };

      const handleEnded = () => {
        if (isMounted) {
          setCurrentTime(0);
          setIsPlaying(false);
        }
      };

      const handlePlay = () => {
        if (isMounted) {
          setIsPlaying(true);
        }
      };

      const handlePause = () => {
        if (isMounted) {
          setIsPlaying(false);
        }
      };

      const handleError = (e: Event) => {
        console.warn('Audio file could not be loaded:', e);
        if (isMounted) {
          setDuration(0);
          // Keep audio element but mark as error
        }
      };

      const handleCanPlay = () => {
        if (isMounted && audioElement) {
          // Audio is ready to play
        }
      };

      if (audioElement) {
        audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.addEventListener('timeupdate', handleTimeUpdate);
        audioElement.addEventListener('ended', handleEnded);
        audioElement.addEventListener('play', handlePlay);
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('error', handleError);
        audioElement.addEventListener('canplay', handleCanPlay);

        // Preload the audio
        audioElement.preload = 'auto';
        
        // Try to load and play on user interaction
        const loadAudio = async () => {
          try {
            if (audioElement) {
              await audioElement.load();
            }
          } catch (err) {
            console.warn('Audio preload failed:', err);
          }
        };
        
        loadAudio();
        setAudio(audioElement);
      }
    } catch (error) {
      console.warn('Failed to create audio element:', error);
      if (isMounted) {
        setAudio(null);
      }
    }

    return () => {
      isMounted = false;
      if (audioElement) {
        audioElement.pause();
        audioElement.removeEventListener('loadedmetadata', () => {});
        audioElement.removeEventListener('timeupdate', () => {});
        audioElement.removeEventListener('ended', () => {});
        audioElement.removeEventListener('play', () => {});
        audioElement.removeEventListener('pause', () => {});
        audioElement.removeEventListener('error', () => {});
        audioElement.removeEventListener('canplay', () => {});
        audioElement = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    if (audio) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err: any) {
        console.warn('Play failed:', err);
        // If autoplay is blocked, try again on user interaction
        if (err.name === 'NotAllowedError') {
          console.warn('Autoplay blocked. User interaction required.');
        }
      }
    }
  };

  const handlePause = () => {
    if (audio) {
      audio.pause();
    }
  };

  const handleStop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audio && duration > 0) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative shrink-0 w-full" data-name="hero">
      <div className="box-border content-stretch flex flex-col items-start justify-start leading-[0] not-italic p-0 relative text-[#000000] text-left w-full">
        <div
          className="font-['Inter:Bold',_sans-serif] font-bold min-w-full relative shrink-0 text-[64px]"
          style={{ width: "min-content" }}
        >
          <p className="block leading-[54px] text-[30px] font-bold">
            Love and Patience
          </p>
        </div>
        <div
          className="font-['Inter:Medium',_sans-serif] font-medium min-w-full relative shrink-0 text-[24px] mb-8"
          style={{ width: "min-content" }}
        >
          <p className="block leading-[normal] text-[24px]">
            pedlar
          </p>
        </div>
        
        {/* Time Slider - Above the buttons */}
        <div className="w-full mb-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSliderChange}
            disabled={!audio || duration === 0}
            className="w-full h-1 bg-black/20 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #000 0%, #000 ${progress}%, rgba(0,0,0,0.2) ${progress}%, rgba(0,0,0,0.2) 100%)`
            }}
          />
          {/* Time Display */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-black/70">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-black/70">
              {formatTime(duration)}
            </span>
          </div>
        </div>

            {/* Playback Controls */}
            <div className="flex flex-row items-center justify-center gap-2 w-full mt-1 mb-0 pb-0">
          <button 
            onClick={handlePlay}
            disabled={!audio}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Play"
          >
            <Play className="w-6 h-6 text-black" fill="black" />
          </button>
          <button 
            onClick={handlePause}
            disabled={!audio}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Pause"
          >
            <Pause
              className="w-6 h-6 text-black"
              fill="black"
            />
          </button>
          <button 
            onClick={handleStop}
            disabled={!audio}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Stop"
          >
            <Square
              className="w-6 h-6 text-black"
              fill="black"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div
      className="relative shrink-0 w-full"
      data-name="legend"
    >
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[55px] items-start justify-start px-0 py-[9px] relative w-full">
          <Hero />
          <div
            className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] min-w-full not-italic relative shrink-0 text-[#000000] text-[16px] text-left"
            style={{ width: "min-content" }}
          >
            <p className="block leading-[normal]"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BioPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const bioImages = [bioImage, "/file/imgs/nico.webp"];

  const handleImageClick = () => {
    setCurrentImage((prev) => (prev + 1) % bioImages.length);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:gap-10 pt-0 pb-4 px-0">
      <h2 className="text-[24px] font-bold mb-4 mt-0 sm:hidden">pedlar</h2>
      <div className="w-full mb-4 flex justify-center sm:w-[30%] sm:min-w-[250px] sm:max-w-[350px] sm:mb-0 sm:justify-start sm:flex-shrink-0">
        <img
          src={bioImages[currentImage]}
          alt="Bio"
          className="w-2/3 max-w-[200px] sm:w-full sm:h-auto sm:max-w-none sm:aspect-[3/4] object-cover rounded-lg cursor-pointer"
          onClick={handleImageClick}
        />
      </div>
      <div className="w-full sm:flex-1 sm:min-w-0 flex flex-col">
        <h2 className="hidden sm:block text-[42px] font-bold mb-4 mt-0">pedlar</h2>
        <div className="text-gray-600 text-base sm:text-[18px] sm:leading-[1.6] mb-4 sm:mb-5">
          <p className="mb-1 italic">Blending intimate vocals with moody lo-fi textures and modern alternative R&B</p>
          <p className="mb-1"><span className="font-medium">Genre(s):</span> Alternative, Electronic, R&B</p>
          <p className="mb-0"><span className="font-medium">Location:</span> Seoul, South Korea</p>
        </div>
        <hr className="border-gray-300 mb-4 sm:mb-5" />
        <div className="text-black text-lg sm:text-[22px] sm:leading-[1.6] font-medium">
          <p className="mb-3 sm:mb-5">
            Based in the vibrant heart of Seoul, pedlar is carving out a distinct space in the world of alternative and indie R&B. Rather than sticking to a single lane, pedlar prefers to blur genre lines, weaving together different genres to create a sound that feels both familiar and refreshingly new. The result is a moody, lo-fi aesthetic that prioritizes texture and feeling over polished perfection.
          </p>
          <p className="mb-0">
            Channeling the atmospheric production of artists like Galimatias and the gritty, guitar-driven intimacy of Mk.gee, pedlar's music is designed for late nights and introspection. It's a sonic blend that invites listeners to get lost in the vibe, offering a laid-back escape from the noise of the city.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoPage() {
  return (
    <div className="w-full flex flex-col pt-0 pb-6 sm:pb-8 px-0">
      <h2 className="text-[24px] sm:text-[31px] font-bold mb-4 sm:mb-5 mt-0">Downloads</h2>
      <div className="text-black text-lg sm:text-[23px] sm:leading-[1.6] leading-relaxed">
        <p className="mb-3 sm:mb-4">
          <a href="https://www.dropbox.com/scl/fo/1whlc7czuth9a1mrkm58x/AEhpRrY02znSlkbJi2Pg51Q?rlkey=7sqb8bnym38f16l5f9jc5f2ut&st=u9usn50g&dl=0" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">DROPBOX</a>
        </p>
        <p className="mb-3 sm:mb-4">
          <a href="https://drive.google.com/drive/folders/1sYDPSZn9AQMzLSzbr4ClAb7SZ3cqhQTJ?usp=sharing" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">GOOGLE DRIVE</a>
        </p>
        <p className="mb-0">Get in touch: haanmusic00@gmail.com</p>
      </div>
    </div>
  );
}

function DiscographyPage({ onBack }: { onBack: () => void }) {
  const discographyItems = [
    { id: 1, title: 'Earth', subtitle: 'pedlar', image: '/file/imgs/earth.webp', spotifyUrl: 'https://open.spotify.com/track/58bt3lWX6NlNNC0BaOFFm9?si=bb1c9a97632f431e' },
    { id: 2, title: 'Better Life', subtitle: 'pedlar', image: '/file/imgs/better_life.webp', spotifyUrl: 'https://open.spotify.com/track/6JDWLfATUhphhaTaEwikue?si=4f5f087ed0be457d' },
    { id: 3, title: 'I Can Make It Easy for You', subtitle: 'pedlar', image: '/file/imgs/i_can_make_it_easy_for_you.jpg', spotifyUrl: 'https://open.spotify.com/track/0peJkJAJBjfdGZCmWPIRqK?si=814f653240f146dd' },
    { id: 4, title: 'Overstating', subtitle: 'pedlar', image: '/file/imgs/overstating.webp', spotifyUrl: 'https://open.spotify.com/track/2jF6ntr2ha5xfubki1rV0f?si=3280f8a2a42241d4' },
    { id: 5, title: 'Hit Like This', subtitle: 'pedlar', image: '/file/imgs/hit_like_this.webp', spotifyUrl: 'https://open.spotify.com/track/0HMMpxnUicESNygKZkmrwP?si=bf3ecbb5f66645bf' },
    { id: 6, title: 'Contrast', subtitle: 'pedlar', image: '/file/imgs/contrast.webp', spotifyUrl: 'https://open.spotify.com/track/5uUpc1u1uAgimFAAHK4XPJ?si=cca4436ef7944178' },
    { id: 7, title: 'Instability', subtitle: 'pedlar', image: '/file/imgs/instability.webp', spotifyUrl: 'https://open.spotify.com/track/01c2dEwfREi1c7PffOruRF?si=aefcc64325b34509' },
    { id: 8, title: 'Talk to Me', subtitle: 'pedlar', image: '/file/imgs/talk_to_me.webp', spotifyUrl: 'https://open.spotify.com/track/67YX17WcyVKHQ5izGQj8AF?si=26e89c5fdaa84df7' },
    { id: 9, title: 'Healthy Amount', subtitle: 'pedlar', image: '/file/imgs/healthy_amount.webp', spotifyUrl: 'https://open.spotify.com/track/7nGOCdQiYlwnE4dH0wMZhE?si=f29fd88a7ad44a38' },
    { id: 10, title: 'Always', subtitle: 'pedlar', image: '/file/imgs/always.webp', spotifyUrl: 'https://open.spotify.com/track/1EhsmY78XzKhwrgSuDosB0?si=beaf598b4dc543de' },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4 mt-0 relative">
        <h2 className="text-[24px]">Discography</h2>
        <button 
          onClick={onBack}
          className="absolute right-0 p-2 hover:bg-black/5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="grid grid-cols-2 gap-3">
          {discographyItems.map((item) => (
            <a
              key={item.id}
              href={item.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="overflow-hidden block"
              style={{ backgroundColor: '#d4c4a8' }}
            >
              <div className="flex flex-col p-2">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-square object-cover mb-2"
                />
                <div className="flex flex-col">
                  <p className="text-[14px] font-medium">{item.title}</p>
                  <p className="text-[11px] text-black/70">{item.subtitle}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EyeCard() {
  const [activeCard, setActiveCard] = useState<CardType>("main");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [cardOffset, setCardOffset] = useState(0);
  const [mainCardHeight, setMainCardHeight] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const mainCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (mainCardRef.current && activeCard === "main") {
      const height = mainCardRef.current.offsetHeight;
      setMainCardHeight(height);
    }
  }, [activeCard]);

  // Track card views and time spent
  useEffect(() => {
    const cardStartTime = Date.now();
    const cardName = activeCard.charAt(0).toUpperCase() + activeCard.slice(1);

    // Track page view for the card
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: cardName,
        page_location: window.location.href,
        page_path: `/${activeCard}`
      });

      // Track card view event
      window.gtag('event', 'card_view', {
        card_name: cardName,
        card_type: activeCard
      });
    }

    // Track time spent when leaving the card
    return () => {
      const timeSpent = Math.round((Date.now() - cardStartTime) / 1000); // in seconds
      if (typeof window !== 'undefined' && window.gtag && timeSpent > 0) {
        window.gtag('event', 'card_time_spent', {
          card_name: cardName,
          card_type: activeCard,
          time_spent_seconds: timeSpent
        });
      }
    };
  }, [activeCard]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : ('clientX' in e ? e.clientX : 0);
    const clientY = 'touches' in e ? e.touches[0].clientY : ('clientY' in e ? e.clientY : 0);
    setTouchEnd(null);
    setTouchStart(clientX);
    setTouchStartY(clientY);
    setIsScrolling(false);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart || !touchStartY) return;
    const clientX = 'touches' in e ? e.touches[0]?.clientX : ('clientX' in e ? e.clientX : 0);
    const clientY = 'touches' in e ? e.touches[0]?.clientY : ('clientY' in e ? e.clientY : 0);
    if (!clientX || !clientY) return;
    
    const diffX = Math.abs(clientX - touchStart);
    const diffY = Math.abs(clientY - touchStartY);
    
    // If already determined to be scrolling, don't process as swipe
    if (isScrolling) return;
    
    // If vertical movement is significantly greater, user is scrolling - don't swipe card
    // Use a 1.5:1 ratio to favor vertical scrolling
    if (diffY > diffX * 1.5 && diffY > 10) {
      setIsScrolling(true);
      setCardOffset(0);
      return;
    }
    
    // Only start treating as horizontal swipe if horizontal movement is clearly dominant
    // Require horizontal to be at least 1.5x vertical and at least 15px
    if (diffX > diffY * 1.5 && diffX > 15) {
      setTouchEnd(clientX);
      
      // Only allow swipe on mobile (touch devices)
      if ('touches' in e) {
        const diff = clientX - touchStart;
        if (activeCard === "main" && diff < 0) {
          setCardOffset(Math.max(diff, -100));
        } else if (activeCard === "bio" && diff > 0) {
          setCardOffset(Math.min(diff, 100));
        } else if (activeCard === "bio" && diff < 0) {
          setCardOffset(Math.max(diff, -100));
        } else if (activeCard === "info" && diff > 0) {
          setCardOffset(Math.min(diff, 100));
        } else if (activeCard === "info" && diff < 0) {
          setCardOffset(Math.max(diff, -100));
        } else if (activeCard === "discography" && diff > 0) {
          setCardOffset(Math.min(diff, 100));
        }
      }
    }
  };

  const onTouchEnd = () => {
    // If user was scrolling, don't process as card swipe
    if (isScrolling) {
      setCardOffset(0);
      setTouchStart(null);
      setTouchStartY(null);
      setTouchEnd(null);
      setIsScrolling(false);
      return;
    }
    
    if (!touchStart || !touchEnd) {
      setCardOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Only process swipe on mobile (when touchStart was set by touch event)
    if (touchStart && isLeftSwipe) {
      if (activeCard === "main") {
        setActiveCard("bio");
      } else if (activeCard === "bio") {
        setActiveCard("info");
      } else if (activeCard === "info") {
        setActiveCard("discography");
      }
    } else if (touchStart && isRightSwipe) {
      if (activeCard === "bio") {
        setActiveCard("main");
      } else if (activeCard === "info") {
        setActiveCard("bio");
      } else if (activeCard === "discography") {
        setActiveCard("info");
      }
    }

    setCardOffset(0);
    setTouchStart(null);
    setTouchStartY(null);
    setTouchEnd(null);
    setIsScrolling(false);
  };

  return (
    <div className={`relative w-full transition-all duration-300 ${activeCard === "bio" ? 'sm:max-w-[1200px] sm:w-[90vw]' : activeCard === "info" ? 'sm:max-w-[600px]' : 'max-w-[458px]'}`}>
      {/* Navigation Buttons - Above the card, always visible */}
      <div className="flex flex-row gap-2 mb-3 justify-center">
        {(["main", "bio", "info", "discography"] as CardType[]).map((card) => (
          <button
            key={card}
            onClick={() => setActiveCard(card)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeCard === card
                ? 'bg-gray-700 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
            style={{ textTransform: 'capitalize' }}
          >
            {card === "main" ? "Main" : card === "bio" ? "Bio" : card === "info" ? "Downloads" : "Discography"}
          </button>
        ))}
      </div>

      {/* Card Container - Match Main card height on mobile */}
      <div className={`relative w-full bg-[var(--cream-background)] ${activeCard === "bio" && !isMobile ? 'rounded-lg' : ''} ${activeCard === "bio" && !isMobile ? '' : 'overflow-hidden'}`} style={{ maxHeight: isMobile ? '85vh' : 'none' }}>
        {/* Main Card */}
        <div 
          ref={mainCardRef}
          className={`bg-[var(--cream-background)] overflow-hidden transition-all duration-300 ease-out ${
            activeCard === "main" ? 'relative' : 'absolute top-0 left-0 w-full'
          }`}
          style={{ 
            transform: activeCard !== "main" ? `translateX(${cardOffset}px)` : 'translateX(0)',
            opacity: activeCard !== "main" ? 0 : 1,
            zIndex: activeCard === "main" ? 10 : 1
          }}
          onTouchStart={(e) => {
            if ('touches' in e) {
              onTouchStart(e);
            }
          }}
          onTouchMove={(e) => {
            if ('touches' in e) {
              onTouchMove(e);
            }
          }}
          onTouchEnd={(e) => {
            if ('touches' in e || 'changedTouches' in e) {
              onTouchEnd();
            }
          }}
        >
          <div className="flex flex-col justify-start overflow-clip relative w-full">
            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center px-[18px] pt-[18px] pb-[4px] relative">
              <Monster />
              <Legend />
            </div>
          </div>
        </div>

        {/* Bio Card */}
        <div 
          className={`absolute top-0 left-0 w-full bg-[var(--cream-background)] transition-all duration-300 ease-out ${
            activeCard === "bio" ? 'pointer-events-auto relative' : 'pointer-events-none'
          }`}
          style={{ 
            transform: activeCard === "bio" 
              ? `translateX(${cardOffset}px)` 
              : activeCard === "main" 
                ? 'translateX(100%)' 
                : 'translateX(-100%)',
            opacity: activeCard === "bio" ? 1 : 0,
            zIndex: activeCard === "bio" ? 10 : 1,
            height: isMobile && mainCardHeight ? `${mainCardHeight}px` : 'auto',
            maxHeight: isMobile ? '85vh' : 'none'
          }}
        onTouchStart={(e) => {
          if ('touches' in e) {
            onTouchStart(e);
          }
        }}
        onTouchMove={(e) => {
          if ('touches' in e) {
            onTouchMove(e);
          }
        }}
        onTouchEnd={(e) => {
          if ('touches' in e || 'changedTouches' in e) {
            onTouchEnd();
          }
        }}
      >
        <div className="flex flex-col relative w-full" style={{ height: isMobile ? '100%' : 'auto', maxHeight: isMobile ? '85vh' : 'none' }}>
          <div 
            className="flex flex-col items-start justify-start px-[18px] pt-[18px] pb-[18px] sm:px-[50px] sm:pt-[40px] sm:pb-[50px] h-full min-h-0 overflow-y-auto" 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <BioPage />
          </div>
        </div>
      </div>

        {/* Info Card */}
        <div 
          className={`absolute top-0 left-0 w-full bg-[var(--cream-background)] overflow-hidden transition-all duration-300 ease-out ${
            activeCard === "info" ? 'pointer-events-auto relative' : 'pointer-events-none'
          }`}
          style={{ 
            transform: activeCard === "info" 
              ? `translateX(${cardOffset}px)` 
              : activeCard === "discography" 
                ? 'translateX(100%)' 
                : 'translateX(-100%)',
            opacity: activeCard === "info" ? 1 : 0,
            zIndex: activeCard === "info" ? 10 : 1,
            height: isMobile && mainCardHeight ? `${mainCardHeight}px` : undefined
          }}
        onTouchStart={(e) => {
          if ('touches' in e) {
            onTouchStart(e);
          }
        }}
        onTouchMove={(e) => {
          if ('touches' in e) {
            onTouchMove(e);
          }
        }}
        onTouchEnd={(e) => {
          if ('touches' in e || 'changedTouches' in e) {
            onTouchEnd();
          }
        }}
      >
        <div className="flex flex-col relative w-full overflow-hidden" style={{ maxHeight: '85vh', height: '100%' }}>
          <div 
            className="flex flex-col items-start justify-start px-[18px] pt-[18px] pb-[18px] sm:px-[24px] sm:pt-[24px] sm:pb-[24px] overflow-y-auto h-full min-h-0" 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <InfoPage />
          </div>
        </div>
      </div>

        {/* Discography Card - No height restriction, allows natural growth */}
        <div 
          className={`absolute top-0 left-0 w-full bg-[var(--cream-background)] overflow-hidden transition-all duration-300 ease-out ${
            activeCard === "discography" ? 'pointer-events-auto relative' : 'pointer-events-none'
          }`}
          style={{ 
            transform: activeCard === "discography" 
              ? `translateX(${cardOffset}px)` 
              : 'translateX(100%)',
            opacity: activeCard === "discography" ? 1 : 0,
            zIndex: activeCard === "discography" ? 10 : 1
          }}
        onTouchStart={(e) => {
          if ('touches' in e) {
            onTouchStart(e);
          }
        }}
        onTouchMove={(e) => {
          if ('touches' in e) {
            onTouchMove(e);
          }
        }}
        onTouchEnd={(e) => {
          if ('touches' in e || 'changedTouches' in e) {
            onTouchEnd();
          }
        }}
      >
        <div className="flex flex-col relative w-full overflow-hidden" style={{ maxHeight: '85vh', height: '100%' }}>
          <div 
            className="flex flex-col items-start justify-start px-[18px] pt-[18px] pb-[18px] w-full h-full overflow-y-auto min-h-0" 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <DiscographyPage onBack={() => setActiveCard("main")} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
