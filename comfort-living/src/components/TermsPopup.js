import React, { useState, useRef, useEffect } from 'react';
import './css/TermsPopup.css';

const TermsPopup = ({ onClose, onAccept }) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const termsRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setIsScrolledToBottom(true);
    } else {
      setIsScrolledToBottom(false);
    }
  };

  useEffect(() => {
    const refCurrent = termsRef.current;
    refCurrent.addEventListener('scroll', handleScroll);
    return () => {
      refCurrent.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Terms and Condities</h2>
        <div className="terms-content" ref={termsRef}>
          <p>Lorem ipsum dolor sit amet. Et Quis porro sit tempora enim eos debitis ipsum ut earum saepe! Aut autem voluptates aut nesciunt Quis eum dicta autem qui internos reprehenderit. Ut facere rerum rem quia quaerat sit error totam cum omnis aliquam. Et molestiae reprehenderit eum facere exercitationem et quos deserunt et nobis sequi. At dolorem cupiditate id placeat omnis qui enim corrupti sit earum modi et consectetur sunt sed unde galisum! Aut quas optio eum ipsa aperiam vel mollitia molestias eos laudantium sunt non laborum quia ut eligendi fuga et velit doloribus. Est consequuntur quibusdam At consequuntur doloremque rem eaque nihil eos excepturi voluptatem ut beatae obcaecati sit omnis voluptates. Nam repudiandae omnis est voluptate dolorem est esse architecto est incidunt corporis et consequatur aperiam aut ullam minima.</p>
          <p>A placeat voluptatem non nesciunt officiis id recusandae aperiam. Ut labore sint et quaerat deserunt ut vero nihil sit fugiat inventore est impedit minima a recusandae dicta. Eos omnis nostrum et quia vitae qui modi atque ab fugit nihil sit aperiam culpa. Qui mollitia dolorem hic cupiditate voluptatem est rerum rerum et distinctio iste aut nostrum impedit. Qui numquam laudantium 33 rerum unde et harum similique est delectus nesciunt est veniam consectetur. Est fugit voluptatum et odit autem aut tenetur sunt et pariatur laudantium ut alias iste. Et repellendus dolorem est tempore quos aut deserunt provident. Ut nesciunt amet aut numquam dolores et dolor voluptatum ad voluptatum sapiente est illum natus. Non saepe odio aut consectetur recusandae sed asperiores itaque eum autem fugiat. Sit voluptas aperiam id voluptas voluptatem et dignissimos amet est repudiandae optio ea vitae perspiciatis hic modi blanditiis ut enim omnis. Et dolore tempora eum blanditiis eveniet id assumenda consequatur.</p>
          <p>Aut minima velit eum libero ratione ut praesentium maxime et possimus temporibus 33 rerum modi sit galisum consequatur. Cum enim amet et quia explicabo quo temporibus neque! Aut rerum doloribus non voluptatem esse ut accusamus libero et aliquam obcaecati non inventore aliquam. Eum galisum officia non architecto voluptatibus eum fuga fugiat ut omnis consequuntur. Qui aliquid consectetur et expedita voluptas qui temporibus sapiente. Ab impedit dolor quo magni repudiandae quo iure consequatur sed libero ipsum. Sit quae voluptates et velit totam non aspernatur ducimus qui nobis quia id voluptas quasi non quia itaque. Est modi dolore et excepturi doloribus et similique atque et nihil inventore quo nostrum maxime est numquam vitae est labore maiores. In nesciunt ullam et error magnam sed quia voluptas cum maxime voluptatem. Non voluptatum quae ut quas velit rem vero minus et aspernatur voluptatibus. Qui assumenda natus qui placeat tenetur cum similique impedit qui inventore rerum ut voluptatem consequuntur a rerum harum ut eligendi veniam. Sed laudantium quis aut quam iusto et quam totam aut totam asperiores qui esse numquam. Ut eveniet dolorem aut consequatur reiciendis sed corporis galisum aut veniam autem eum quia alias qui voluptate eligendi aut voluptatem nesciunt. Sit fugiat consectetur qui deserunt consequatur ut porro ipsam cum nesciunt ipsa qui accusantium nemo est velit explicabo.</p>
        </div>
        <button onClick={onAccept} disabled={!isScrolledToBottom}>Accept</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TermsPopup;
