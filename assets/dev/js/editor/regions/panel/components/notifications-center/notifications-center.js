/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';

function Notifications() {
  const [ notifications, setNotifications ] = useState( [] );
  const [ isOpen, setIsOpen ] = useState( false );
  const [ showUnread, setShowUnread ] = useState( false );
  const [ animateClass, setAnimateClass ] = useState( '' );
  useEffect( () => {
    const items = [
      {
        type: 'feature',
        id: 0,
        title: 'Notes',
        description: 'Introducing Notes - Work collaboratively directly within Elementor.',
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Learn More',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'experiment',
        id: 1,
        title: 'Lazyload Background images',
        description: "Introducing Lazyload Background images - improve your site's performance!",
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Activate Now',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'news',
        id: 2,
        title: 'Elementor Acquires Strattic',
        description: 'Elementor acquires Strattic, the leading WordPress static hosting solution for secure, high-performance websites. This decision strengthens our ability to provide an end-to-end solution.',
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Read More',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'feature',
        id: 3,
        title: 'Performance lab support',
        description: "Introducing Performance lab support - Performance lab support to improve your site's performance",
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Learn More',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'feature',
        id: 4,
        title: 'Notes',
        description: 'Introducing Notes - Work collaboratively directly within Elementor',
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Read more',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'experiment',
        id: 5,
        title: 'Lazyload Background images',
        description: "Introducing Lazyload Background images - Lazyload Background images to improve your site's performance",
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Read more',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'news',
        id: 6,
        title: 'Elementor Acquires Strattic',
        description: 'Elementor acquires Strattic, the leading WordPress static hosting solution for secure, high-performance websites. This decision strengthens our ability to provide an end-to-end solution.',
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Read more',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'feature',
        id: 7,
        title: 'Performance lab support',
        description: "Introducing Performance lab support - Performance lab support to improve your site's performance",
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Read more',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'feature',
        id: 8,
        title: 'Performance lab support',
        description: "Introducing Performance lab support - Performance lab support to improve your site's performance",
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Read more',
          url: 'https://www.google.com',
        },
        read: false,
      },
      {
        type: 'feature',
        id: 9,
        title: 'Performance lab support',
        description: "Introducing Performance lab support - Performance lab support to improve your site's performance",
        date: '2022-03-01 00:00:00',
        cta_button: {
          label: 'Read more',
          url: 'https://www.google.com',
        },
        read: false,
      },
    ];

    setNotifications( updateReaded( items ) );
    setShowUnread( 'true' === localStorage.getItem( 'e-notifications-show-unread' ) );
    if ( items.filter( ( items ) => ! items.read ).length > 0 ) {
      setAnimateClass( 'bell-animation' );
    }
  }, [] );

  const sendGoogleAnalyticsEvent = ( notification, action ) => {
    console.log( 'Send Google Analytics event', notification, action );
  };

  const updateReaded = ( items ) => {
    const readNotifications = JSON.parse( localStorage.getItem( 'e-notifications' ) );
    if ( readNotifications ) {
      if ( readNotifications.length > 0 ) {
        items = items.map( ( item ) => {
          if ( readNotifications.includes( item.id ) ) {
            item.read = true;
          }
          return item;
        } );
      }
    }
    return items;
  };

  const toggleNotifications = () => {
    setIsOpen( ! isOpen );
    setAnimateClass( '' );
  };

  const markAsRead = ( notification ) => {
    let readedItems = localStorage.getItem( `e-notifications` );
    readedItems = readedItems ? JSON.parse( readedItems ) : [];
    if ( ! readedItems.includes( notification.id ) ) {
      readedItems.push( notification.id );
      localStorage.setItem( `e-notifications`, JSON.stringify( readedItems ) );
      setNotifications( notifications.map( ( item ) => {
        if ( item.id === notification.id ) {
          item.read = true;
        }
        return item;
      },
      ) );
    }
  };

  const showOnlyUnreadToggle = ( element ) => {
    const unread = element.target.checked;
    setShowUnread( unread );
    localStorage.setItem( `e-notifications-show-unread`, unread );
  };

  const readNotification = ( notification ) => {
    markAsRead( notification );
    sendGoogleAnalyticsEvent( notification, 'click' );
    window.open( notification.cta_button.url, '_blank' );
  };

  return (
	<>
		<div className="notifications-indicator" onClick={ toggleNotifications }>
			<span className={ `notifications-indicator__icon ${ animateClass }` }>
				<i className="eicon-woocommerce-notices" />
				{ notifications.filter( ( notification ) => ! notification.read ).length > 0 && <span className="notifications-indicator__count">{ notifications.filter( ( notification ) => ! notification.read ).length }</span> }
			</span>
		</div>
		{ isOpen && (
		<div className="notifications-wrapper">
			<div className="notifications-header disable-selection">
				<h3>Notifications</h3>
				<div className="show-unread">
					Only show unreads <input className="show-undread-toogle" type="checkbox" onChange={ showOnlyUnreadToggle } checked={ showUnread } />
				</div>
			</div>
			<div className="notifications-list">
				{ notifications.map( ( notification, index ) => {
              if ( showUnread && notification.read ) {
                return null;
              }
              return (
	<div className="notification-item disable-selection" key={ index } >
		<div className="notification-item__type">
			<span className={ `notification-item__type` }>{ notification.type }</span>
		</div>
		<div className="notification-item__content">
			<div className="notification-item__content__title">
				{ notification.title }
			</div>
			<div className="notification-item__content__description">
				{ notification.description }
			</div>
			<div className="notification-item__content__cta">
				<button
					onClick={ () => {
                          readNotification( notification );
                        } }
					className="notification-item__content__cta__button" rel="noreferrer">
					{ notification.cta_button.label }
				</button>
			</div>
			<div className="notification-item__content__date">
				{ notification.date }
			</div>
			<div className={ `notification-item__content__read ${ notification.read }` }>
				{ notification.read &&
				<i className="eicon-read" />
        }
				{ ! notification.read &&
				<i className="eicon-unread" />
        }
			</div>
		</div>
	</div>
              );
            },
            ) }
			</div>
		</div>
      )
      }
	</>
  );
}

export default Notifications;
