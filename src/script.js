const vendorScripts = [

	// jquery
	{
		src: 'https://code.jquery.com/jquery-3.3.1.min.js',
		onload: documentReady,
	},

	// youtube
	{
		src: 'https://www.youtube.com/iframe_api',
	}

];




/**
 * Preload vendor scripts
 */
vendorScripts.forEach(({src, onload}) => {
	if ( !src ) return;
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.async = true;
	script.onload = () => {
		script.remove();
		if ( typeof onload === 'function' ) onload();
	};
	script.src = src;
	document.getElementsByTagName('head')[0].appendChild(script);
});




/**
 * --------------------------------------------------------------------------------------------
 * APP SCRIPTS
 * --------------------------------------------------------------------------------------------
 */

let $titles;

let player;
let duration;
let activeItem;
let currentTime = 0;
let playbackInterval;
let ctaInstance = {
	'clicked' : false,
	'index' : null
};
// let VIDEO_ID = '6CgrVt3BGqY';
let VIDEO_ID = 'S8P5wDv1_1g';

// Player Variables
let PLAYER_VARS = {
	autoplay: 1, 
	autohide: 1, 
	modestbranding: 0, 
	rel: 0, 
	showinfo: 0, 
	controls: 0,
	loop: 1, 
	disablekb: 1, 
	enablejsapi: 0, 
	iv_load_policy: 3
}

// Video Object
let VIDEO_OBJ = {
	videoId: VIDEO_ID,
	suggestedQuality: 'hd720'
}

const segmentDuration = 4;
const segments = [
	segmentDuration*0,
	segmentDuration*1,
	segmentDuration*2
];


function documentReady () {
	$titles = $('.hero__title');
	$blackOverlay = $('.hero__black_overlay');
	$heroContent = $('.hero__content');
	$heroPlate = $('.hero__plate');
	// For HTML5 Version only
	player = $('video#hero__salt_video');

	bindTitleClick();

	// CTA Click
	$('.hero__cta__button').click(() => {
		$heroContent.addClass('animated');
		$blackOverlay.addClass('animated');

		setTimeout(() => {
			$heroPlate.addClass('animated');
		}, 2000)

		// Sets the data of the current clicked item,
		// Flags clicked to true so we can reuse the old method tracking
		// the original flow of the video timeline
		ctaInstance.clicked = true;
		ctaInstance.index = $('.hero__cta__button').data('index');
	})

	// For HTML 5 Version only
	playbackInterval = setInterval(onTimeUpdate, 100);

	$('.hero__plate').on('transitionend', function() {
		$('.hero__plate > img').hide();
		$('.hero__plate > video').addClass('animated');
		$('.hero__plate > video')[0].play();
	})
}


// function onYouTubeIframeAPIReady() {
// 	player = new YT.Player('hero__video__player', {
// 		playerVars: PLAYER_VARS,
// 		events: {
// 			'onReady': onPlayerReady,
// 			'onStateChange': onPlayerStateChange
// 		}
// 	});
// }

// function onPlayerReady() {
// 	// Loaded video on player on player ready
// 	player.loadVideoById(VIDEO_OBJ);
// 	player.playVideo();
// 	player.mute();
// 	duration = player.getDuration();
// 	playbackInterval = setInterval(onTimeUpdate, 100);
// }

// // For smooth transition when video reaches the end.
// function onPlayerStateChange(e) {
// 	if ( e.data === 0 ) {
// 		player.seekTo(segments[0]);
// 	}
// }

// function onTimeUpdate () {
// 	currentTime = player.getCurrentTime();

// 	switch( true ) {
// 		case (currentTime >= segments[2]):
// 			activateItem(2);
// 			break;
// 		case (currentTime >= segments[1]):
// 			activateItem(1);
// 			break;
// 		default:
// 			activateItem(0);
// 	}

// 	updateProgessBar();
// }

// FOR HTML 5 VERSION
function onTimeUpdate() {
	if ( !ctaInstance.clicked ) {
		currentTime = player[0].currentTime;
		switch( true ) {
			case (currentTime >= segments[2]):
				activateItem(2);
				break;
			case (currentTime >= segments[1]):
				activateItem(1);
				break;
			default:
				activateItem(0);
		}

		updateProgessBar();
	} else {
		currentTime = player[0].currentTime;
		switch ( ctaInstance.index ) {
			case 0 :
				if ( currentTime >= (segments[1] - 1 ) ) {
					player[0].currentTime = segments[0] + 0.5;
				}
				break;
			case 1 :
				if ( currentTime >= (segments[2] - 1 ) ) {
					player[0].currentTime = segments[1] + 0.5;
				}
				break;
			case 2 :
				if ( currentTime >= (parseInt(player[0].duration) - 1) ) {
					player[0].currentTime = segments[2] + 0.5;
				}
				break;
		}
	}
}

function activateItem( itemIndex ) {
	if ( itemIndex === activeItem ) return;

	$('.hero__cta__button').attr('data-index', itemIndex);

	$titles.filter('.active')
		// Remove active class
		.removeClass('active')
		// Remove progress bar transform
		.find('.hero__title__progress')
		.css('transform', '')
		.end().end()
		// Active cuttent item
		.eq(itemIndex).addClass('active');

	activeItem = itemIndex;

}

function updateProgessBar() {
	if ( typeof activeItem !== 'number' ) return;

	let $activeItem = $titles.eq(activeItem);
	let $activeProgressBar = $activeItem.find('.hero__title__progress');
	let progressRatio = (currentTime - (segmentDuration * activeItem)) / segmentDuration;
	let progressPercent = 100 * progressRatio;
	let transformPercent = progressPercent - 100;

	$activeProgressBar.css('transform', 'translateX('+transformPercent+'%)');

}

function bindTitleClick() {
	$titles.each(function (index) {
		$(this).click(function () {
			// For HTML 5 Version only
			player[0].currentTime = segments[index];
			// player.seekTo(segments[index]);
		});
	});
}

