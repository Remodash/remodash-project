'use client'

import { useState, useEffect } from 'react';
import { Home, Bell, ClipboardCheck, Brain, Hammer, Star, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Menu, X, Check, ChevronRight, ArrowRight } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation for stats counter
  const [stats, setStats] = useState([
    { value: 0, target: 90, text: "de temps économisé sur la gestion administrative des départs" },
    { value: 0, target: 60, text: "de réduction des erreurs dans la détermination des diagnostics obligatoires" },
    { value: 0, target: 30, text: "de gain de temps sur la gestion des travaux grâce à l'automatisation" },
    { value: 0, target: 100, text: "conforme à la réglementation en vigueur pour tous vos dossiers" }
  ]);

  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: Math.floor(progress * stat.target)
        }))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <>
      <Head>
        <title>RemoDAsh - Gestion Immobilière Intelligente</title>
        <meta name="description" content="La plateforme intelligente qui automatise le processus de départ des locataires et optimise la gestion des travaux associés." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-primary-500 mr-2" />
              <span className="text-2xl font-bold text-primary-600">RemoDAsh</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="font-medium hover:text-primary-500 transition">Fonctionnalités</a>
              <a href="#process" className="font-medium hover:text-primary-500 transition">Processus</a>
              <a href="#testimonials" className="font-medium hover:text-primary-500 transition">Témoignages</a>
              <a href="#contact" className="font-medium hover:text-primary-500 transition">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="hidden md:inline-block px-4 py-2 font-medium hover:text-primary-500 transition">Connexion</a>
              <a 
                href="#contact" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-bold transition shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Essai gratuit
              </a>
              <button 
                className="md:hidden focus:outline-none" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} pt-4 transition-all duration-300 ease-in-out`}>
            <div className="flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-xl">
              <a 
                href="#features" 
                className="font-medium hover:text-primary-500 transition px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a 
                href="#process" 
                className="font-medium hover:text-primary-500 transition px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Processus
              </a>
              <a 
                href="#testimonials" 
                className="font-medium hover:text-primary-500 transition px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Témoignages
              </a>
              <a 
                href="#contact" 
                className="font-medium hover:text-primary-500 transition px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <a 
                href="#" 
                className="font-medium hover:text-primary-500 transition px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:100px_100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-fadeInUp">
              Transformez votre gestion immobilière avec <span className="text-primary-300">RemoDAsh</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 opacity-90 animate-fadeInUp delay-100">
              La plateforme intelligente qui automatise le processus de départ des locataires et optimise la gestion des travaux associés.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fadeInUp delay-200">
              <a 
                href="#contact" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center flex items-center justify-center"
              >
                Démarrer gratuitement <ChevronRight className="ml-2 w-5 h-5" />
              </a>
              <a 
                href="#features" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 text-center flex items-center justify-center"
              >
                Voir la démo <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 hero-image animate-fadeIn delay-300">
            <div className="relative rounded-xl shadow-2xl border-8 border-white overflow-hidden transform hover:scale-105 transition duration-500">
              <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Tableau de bord RemoDAsh" 
                width={800} 
                height={600} 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problèmes/Solutions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fini les complications de la gestion locative</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Le processus de départ d'un locataire est souvent source de stress et de perte de temps. RemoDAsh simplifie chaque étape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 animate-fadeInUp delay-100">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-bold mb-4 text-orange-600 flex items-center">
                <X className="w-5 h-5 mr-2" /> Problèmes courants
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Suivi manuel des notifications de départ et des états des lieux</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Coordination complexe entre gestionnaires, gardiens et prestataires</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Erreurs dans la détermination des diagnostics obligatoires</span>
                </li>
                <li className="flex items-start">
                  <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Calculs fastidieux des parts locataire/bailleur pour les travaux</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2" /> Solutions RemoDAsh
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>Automatisation du processus dès réception du congé locataire</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>Coordination centralisée de tous les intervenants</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>IA pour déterminer les diagnostics requis selon la réglementation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                  <span>Calcul automatique des quotes-parts selon la grille de vétusté</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Clés */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Une solution complète pour tous vos besoins</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les fonctionnalités clés qui font de RemoDAsh l'outil indispensable des gestionnaires immobiliers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp delay-100">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestion des départs</h3>
              <p className="text-gray-600">
                Automatisation complète du processus dès réception du congé locataire, avec notifications aux différents services.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp delay-200">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pré-État des Lieux</h3>
              <p className="text-gray-600">
                Formulaire numérique et prise de photos intégrée pour un inventaire précis du logement.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp delay-300">
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">IA pour diagnostics</h3>
              <p className="text-gray-600">
                Analyse intelligente pour déterminer les diagnostics obligatoires selon la réglementation en vigueur.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp delay-400">
              <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestion des travaux</h3>
              <p className="text-gray-600">
                Génération automatique des bons de travaux avec calcul des quotes-parts locataire/bailleur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section id="process" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Processus optimisé de gestion des départs</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez comment RemoDAsh rationalise chaque étape du processus de départ d'un locataire.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInLeft">
              <div className="relative rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-500">
                <Image 
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Processus RemoDAsh" 
                  width={800} 
                  height={600} 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>
            </div>
            
            <div className="space-y-8 animate-fadeInRight">
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Notification de départ</h3>
                <p className="text-gray-600">
                  Dès réception du courrier de congé, la date de sortie est saisie dans ImmoWare et synchronisée avec RemoDAsh.
                </p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Vérification des impayés</h3>
                <p className="text-gray-600">
                  Notifie automatiquement les services concernés en cas d'impayés et alerte le gestionnaire technique.
                </p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Pré-État des Lieux</h3>
                <p className="text-gray-600">
                  Le gardien effectue l'inventaire via l'application mobile avec photos et relevés de compteurs.
                </p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Diagnostics IA</h3>
                <p className="text-gray-600">
                  Notre intelligence artificielle détermine les diagnostics obligatoires selon les caractéristiques du logement.
                </p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">5</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Gestion des travaux</h3>
                <p className="text-gray-600">
                  Génération des bons de travaux avec calcul automatique des quotes-parts selon la grille de vétusté.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages/Bénéfices */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi choisir RemoDAsh ?</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Les bénéfices tangibles pour votre activité de gestion immobilière
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-bold mb-4 animate-countUp">
                  {stat.value}%
                </div>
                <p className="font-medium">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que disent les professionnels qui utilisent déjà RemoDAsh
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp delay-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                  <Image 
                    src="https://randomuser.me/api/portraits/women/43.jpg" 
                    alt="Marie D." 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Marie D.</h4>
                  <p className="text-sm text-gray-500">Gestionnaire locative</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "RemoDAsh a révolutionné notre gestion des départs. L'automatisation des diagnostics et des bons de travaux nous fait gagner un temps précieux tout en réduisant les erreurs."
              </p>
              <div className="flex mt-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp delay-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                  <Image 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Pierre L." 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Pierre L.</h4>
                  <p className="text-sm text-gray-500">Responsable technique</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "La fonctionnalité IA pour les diagnostics est remarquable. Elle prend en compte tous les paramètres réglementaires et nous propose une liste pertinente de diagnostics à réaliser."
              </p>
              <div className="flex mt-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp delay-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                  <Image 
                    src="https://randomuser.me/api/portraits/women/65.jpg" 
                    alt="Sophie T." 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Sophie T.</h4>
                  <p className="text-sm text-gray-500">Directrice d'agence</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "La transparence sur le calcul des quotes-parts travaux est appréciée par tous. Les locataires acceptent plus facilement les déductions quand elles sont justifiées par le système."
              </p>
              <div className="flex mt-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">RemoDAsh en images</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez notre interface moderne et intuitive à travers ces captures
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeInUp">
            {[
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581093057305-5e4391a4df08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581093057305-5e4391a4df08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            ].map((img, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Image 
                  src={img} 
                  alt={`Gallery image ${index + 1}`} 
                  width={400} 
                  height={300} 
                  className="w-full h-48 object-cover transition duration-500 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <span className="text-white font-medium">Interface RemoDAsh</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-800 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:100px_100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à révolutionner votre gestion immobilière ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines de professionnels qui ont déjà fait le choix de RemoDAsh
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="#" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              Commencer maintenant - 14 jours gratuits <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center"
            >
              Parler à un expert <Phone className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Home className="w-6 h-6 text-blue-500 mr-2" />
                <span className="text-xl font-bold">RemoDAsh</span>
              </div>
              <p className="text-gray-400">
                La solution intelligente pour la gestion immobilière moderne.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Produit</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tarifs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Intégrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Nouveautés</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Webinaires</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <a href="mailto:contact@remodash.com" className="text-gray-400 hover:text-white transition">contact@remodash.com</a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <a href="tel:+33123456789" className="text-gray-400 hover:text-white transition">+33 1 23 45 67 89</a>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-400">Paris, France</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">© 2023 RemoDAsh. Tous droits réservés.</div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes countUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-countUp {
          animation: countUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </>
  );
}