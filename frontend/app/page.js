'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      try {
        const profile = await authAPI.getProfile();
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();

    fetch('http://localhost:8000/api/hotel/rooms/')
      .then(res => res.json())
      .then(data => {
        setRooms(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch rooms:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.page}>

      {/* Navbar Overlay */}
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>SmartStay</h1>
        <div className={styles.navLinks}>
          {isAuth ? (
            <Link href="/register" className={styles.navBtn}>Go to Dashboard</Link>
          ) : (
            <Link href="/register" className={styles.navBtn}>Sign In / Register</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <Image src="/hero.png" alt="Luxury Hotel Lobby" fill style={{ objectFit: 'cover', zIndex: -1 }} quality={100} priority />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Welcome to Our Smart Stay Hotel</h2>
          <p className={styles.heroSubtitle}>Your sanctuary of comfort and elegance awaiting your arrival.</p>
          <Link href="/register" className={styles.ctaButton}>
            {isAuth ? 'View Your Bookings' : 'Book Your Stay'}
          </Link>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.sectionHeader}>
          <h3>Our Exquisite Textures</h3>
          <div className={styles.separator}></div>
        </div>

        {loading ? (
          <p>Loading rooms...</p>
        ) : rooms.length > 0 ? (
          <div className={styles.roomGrid}>
            {rooms.map(room => (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.roomImagePlaceholder}>Room Image</div>
                <div className={styles.roomInfo}>
                  <h4>Room {room.number}</h4>
                  <p className={styles.roomType}>{room.category ? room.category.name : 'Standard'}</p>
                  <p className={styles.roomPrice}>ETB {room.category ? room.category.base_price : 'N/A'} <span style={{ fontSize: '0.8rem' }}>per night</span></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No rooms available at the moment.</p>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2026 SmartStay. Define Luxury.</p>
      </footer>
    </div>
  );
}
