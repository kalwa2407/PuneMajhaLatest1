'use client'

import { Building2, Users, Target, Mail, Phone, MapPin, Award, Newspaper, Briefcase, BookOpen, Heart, FileText, Globe, Smartphone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/lib/siteConfig'

const AboutUsPage = () => {
  const { language } = useLanguage()
  const brandName = siteConfig.brand.localizedName[language] || siteConfig.brand.name
  const addressText = siteConfig.contact.address[language] || siteConfig.contact.address.en
  const chiefEditor = siteConfig.brand.chiefEditor[language] || siteConfig.brand.chiefEditor.en
  const motto = siteConfig.brand.motto[language] || siteConfig.brand.motto.en

  const coverageAreas = [
    { icon: Building2, title: language === 'mr' ? 'प्रशासन आणि पायाभूत सुविधा' : language === 'hi' ? 'शासन और बुनियादी ढांचा' : 'Governance & Infrastructure', bg: 'bg-green-100', text: 'text-green-600' },
    { icon: BookOpen, title: language === 'mr' ? 'शिक्षण आणि आरोग्य' : language === 'hi' ? 'शिक्षा और स्वास्थ्य सेवा' : 'Education & Healthcare', bg: 'bg-blue-100', text: 'text-brand-navy' },
    { icon: Heart, title: language === 'mr' ? 'पर्यावरण आणि जनहित' : language === 'hi' ? 'पर्यावरण और जनहित' : 'Environment & Public Interest', bg: 'bg-red-100', text: 'text-brand-red' },
    { icon: Briefcase, title: language === 'mr' ? 'व्यापार आणि तंत्रज्ञान' : language === 'hi' ? 'व्यापार और तकनीक' : 'Business & Technology', bg: 'bg-purple-100', text: 'text-purple-600' },
    { icon: Award, title: language === 'mr' ? 'खेळ आणि मनोरंजन' : language === 'hi' ? 'खेल और मनोरंजन' : 'Sports & Entertainment', bg: 'bg-orange-100', text: 'text-orange-600' },
    { icon: FileText, title: language === 'mr' ? 'गुन्हे आणि स्थानिक बातम्या' : language === 'hi' ? 'अपराध और स्थानीय समाचार' : 'Crime & Local News', bg: 'bg-pink-100', text: 'text-pink-600' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
          {language === 'mr' ? (
            <>पुणे माझा न्यूज <span className="text-brand-red">विषयी</span></>
          ) : language === 'hi' ? (
            <>पुणे माझा न्यूज़ के <span className="text-brand-red">बारे में</span></>
          ) : (
            <>About <span className="text-brand-red">Pune Majha News</span></>
          )}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto font-medium">
          {motto} — {language === 'mr' ? 'विश्वसनीय, नैतिक आणि प्रभावी पत्रकारिता' : language === 'hi' ? 'विश्वसनीय, नैतिक और प्रभावशाली पत्रकारिता' : 'Credible, Ethical, and Impactful Journalism'}
        </p>
      </div>

      {/* Who We Are */}
      <section className="mb-12">
        <Card className="border-l-4 border-l-brand-red overflow-hidden">
          <CardContent className="p-0">
            <div className="md:flex">
              <div className="md:w-1/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600"
                  alt={`${brandName} Newsroom`}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-lg shrink-0">
                    <Newspaper className="h-8 w-8 text-brand-red" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy mb-4">
                      {language === 'mr' ? 'आम्ही कोण आहोत' : language === 'hi' ? 'हम कौन हैं' : 'Who We Are'}
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {language === 'mr'
                        ? 'पुणे माझा न्यूज (Pune Majha News) हे केवळ एक न्यूज पोर्टल नाही, तर पुणे आणि पुणेकरांच्या भावनांशी जोडलेले एक आधुनिक, विश्वासार्ह आणि वेगवान डिजिटल व्यासपीठ आहे. शिक्षण, संस्कृती, उद्योग आणि राजकारणाचे केंद्र असलेल्या पुण्याच्या आणि पिंपरी-चिंचवडच्या प्रत्येक बातमीला आम्ही तितक्याच ताकदीने मांडतो.'
                        : language === 'hi'
                          ? 'पुणे माझा न्यूज़ (Pune Majha News) केवल एक समाचार पोर्टल नहीं है, बल्कि पुणे और पुणेकरों की भावनाओं से जुड़ा एक आधुनिक, विश्वसनीय और तेज़ डिजिटल मंच है। शिक्षा, संस्कृति, उद्योग और राजनीति के केंद्र पुणे व महाराष्ट्र की हर महत्वपूर्ण ख़बर को हम पूरी निष्पक्षता से आपके सामने लाते हैं।'
                          : 'Pune Majha News is a modern, credible, and fast 24x7 digital news platform deeply connected to Pune and its citizens. From Vishrantwadi and Pimpri-Chinchwad to Koregaon Park, Hadapsar, and Katraj — we deliver fearless local reporting alongside key Maharashtra and national stories.'}
                    </p>
                    <p className="text-sm font-semibold text-brand-navy">
                      {language === 'mr' ? `मुख्य संपादक: ${chiefEditor}` : language === 'hi' ? `मुख्य संपादक: ${chiefEditor}` : `Chief Editor: ${chiefEditor}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Editorial Philosophy */}
      <section className="mb-12">
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-brand-navy" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">
                {language === 'mr' ? 'आमचे संपादकीय तत्त्वज्ञान' : language === 'hi' ? 'हमारा संपादकीय दर्शन' : 'Our Editorial Philosophy'}
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {language === 'mr'
                ? 'आमचे संपादकीय तत्त्वज्ञान अचूकता, निष्पक्षता आणि वेग यावर आधारित आहे. आम्ही प्रशासन, पायाभूत सुविधा, शिक्षण, आरोग्य सेवा, पर्यावरण, गुन्हेगारी, व्यापार, तंत्रज्ञान, खेळ आणि मनोरंजन यासह अनेक श्रेणींमध्ये वस्तुस्थितीवर आधारित रिपोर्टिंग आणि सखोल विश्लेषणाला प्राधान्य देतो.'
                : language === 'hi'
                  ? 'हमारा संपादकीय दर्शन सटीकता, तटस्थता और गति पर आधारित है। हम शासन, बुनियादी ढांचे, शिक्षा, स्वास्थ्य सेवा, पर्यावरण, अपराध, व्यापार, प्रौद्योगिकी, खेल और मनोरंजन सहित कई श्रेणियों में तथ्य-आधारित रिपोर्टिंग और गहन विश्लेषण को प्राथमिकता देते हैं।'
                  : 'Our editorial philosophy is built on accuracy, neutrality, and speed. We prioritize fact-based reporting and in-depth analysis across governance, infrastructure, education, healthcare, environment, crime, business, technology, sports, and entertainment.'}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Coverage Areas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-brand-navy mb-6 text-center">
          {language === 'mr' ? 'आमचे कव्हरेज क्षेत्र' : language === 'hi' ? 'हमारे कवरेज क्षेत्र' : 'Our Coverage Areas'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coverageAreas.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 ${item.bg} rounded-lg`}>
                  <item.icon className={`h-5 w-5 ${item.text}`} />
                </div>
                <span className="font-medium text-gray-900">{item.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Digital Presence */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-blue-50/70 to-white border-l-4 border-l-brand-navy">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-brand-navy" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy">
                {language === 'mr' ? 'मोबाईल-प्रथम दृष्टिकोन' : language === 'hi' ? 'मोबाइल-प्रथम दृष्टिकोण' : 'Mobile-First Approach'}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {language === 'mr'
                ? `${brandName} मोबाईल-प्रथम दृष्टिकोन आणि सोशल मीडिया प्लॅटफॉर्मवर मजबूत उपस्थितीसह कधीही, कुठेही बातम्यांमध्ये अखंड प्रवेश सुनिश्चित करते. वाचक फक्त बातम्या वाचत नाहीत तर स्थानिक प्रश्नांवर थेट संवाद साधू शकतात.`
                : language === 'hi'
                  ? `${brandName} मोबाइल-प्रथम दृष्टिकोण और अग्रणी सोशल मीडिया प्लेटफॉर्म पर मजबूत उपस्थिति के साथ कभी भी, कहीं भी समाचारों तक निर्बाध पहुंच सुनिश्चित करता है।`
                  : `With a mobile-first approach and an active presence across digital and social channels, ${brandName} ensures seamless access to breaking updates, civic issues, and community stories anytime, anywhere.`}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Citizen Journalism */}
      <section className="mb-12">
        <Card className="bg-gradient-to-r from-green-50 to-white border-l-4 border-l-green-600">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'mr' ? 'नागरिक पत्रकारांचे सक्षमीकरण' : language === 'hi' ? 'नागरिक पत्रकारों का सशक्तिकरण' : 'Empowering Citizen Journalists'}
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {language === 'mr'
                ? 'नागरिक पत्रकारांना सक्षम करून आणि आमचे बातमीदार नेटवर्क विस्तारून, आम्ही तळागाळातील आवाज वाढवण्याचा आणि वाचकांपर्यंत अस्सल स्थानिक कथा आणण्याचा प्रयत्न करतो.'
                : language === 'hi'
                  ? 'नागरिक पत्रकारों को सशक्त बनाकर और अपने संवाददाता नेटवर्क का विस्तार करके, हम जमीनी स्तर की आवाजों को बुलंद करने और प्रामाणिक स्थानीय कहानियां लाने का प्रयास करते हैं।'
                  : 'By empowering citizen journalists and expanding our correspondent network, we amplify grassroots voices and bring authentic local stories directly to readers.'}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Vision */}
      <section className="mb-12">
        <Card className="bg-slate-50 border-t-4 border-t-brand-navy">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="h-8 w-8 text-brand-navy" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">
              {language === 'mr' ? 'आमची दृष्टी' : language === 'hi' ? 'हमारा दृष्टिकोण' : 'Our Vision'}
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed italic">
              {language === 'mr'
                ? `"${brandName} — ${motto} कारण पुणे फक्त शहर नाही, तर एक भावना आहे!"`
                : language === 'hi'
                  ? `"${brandName} जिम्मेदार पत्रकारिता, सामुदायिक जुड़ाव और पुणे की वास्तविक भावना का प्रतीक है।"`
                  : `"${brandName} stands for responsible journalism, community engagement, and the true spirit of Pune."`}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Contact Information */}
      <section>
        <Card className="border-t-4 border-t-brand-red">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Building2 className="h-6 w-6 text-brand-red" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy">
                {language === 'mr' ? 'संपर्क साधा' : language === 'hi' ? 'संपर्क करें' : 'Contact Us'}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-red mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {language === 'mr' ? 'मुख्य कार्यालय' : language === 'hi' ? 'प्रधान कार्यालय' : 'Head Office'}
                  </p>
                  <p className="text-gray-600 text-sm">{addressText}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-red mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {language === 'mr' ? 'फोन' : language === 'hi' ? 'फ़ोन' : 'Phone'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {siteConfig.contact.phoneDisplay} / {siteConfig.contact.secondaryPhoneDisplay}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-red mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {language === 'mr' ? 'ईमेल' : language === 'hi' ? 'ईमेल' : 'Email'}
                  </p>
                  <p className="text-gray-600 text-sm">{siteConfig.contact.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default AboutUsPage
