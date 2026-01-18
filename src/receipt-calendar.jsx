import React, { useState, useEffect } from 'react';

const ReceiptCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isPrinting, setIsPrinting] = useState(true);
  const [printProgress, setPrintProgress] = useState(0);
  const [showPrinter, setShowPrinter] = useState(true);
  const [confetti, setConfetti] = useState([]);
  const [fortuneMessage, setFortuneMessage] = useState(null);

  // Fortune cookie messages / positive quotes
  const fortunes = [
    "Time you enjoy wasting is not wasted time.",
    "Today is a gift. That's why it's called the present.",
    "The best time to plant a tree was yesterday. The second best time is now.",
    "Your future is created by what you do today.",
    "Every day is a second chance.",
    "Be the energy you want to attract.",
    "Small steps every day lead to big changes.",
    "You are exactly where you need to be.",
    "Good things take time. Be patient.",
    "Your only limit is your mind.",
    "Make today so awesome that yesterday gets jealous.",
    "The secret of getting ahead is getting started.",
    "Believe you can and you're halfway there.",
    "Stars can't shine without darkness.",
    "What you seek is seeking you.",
    "Be a voice, not an echo.",
    "Dream big. Start small. Act now.",
    "Happiness is homemade.",
  ];

  const revealFortune = () => {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortuneMessage(randomFortune);
  };

  // US Holidays (month is 0-indexed) - dates for 2026
  const usHolidays = [
    { month: 0, day: 1, name: "New Year's Day" },
    { month: 0, day: 19, name: "MLK Day" }, // 3rd Monday of January
    { month: 1, day: 14, name: "Valentine's Day" },
    { month: 1, day: 16, name: "Presidents' Day" }, // 3rd Monday of February
    { month: 2, day: 17, name: "St. Patrick's Day" },
    { month: 4, day: 25, name: "Memorial Day" }, // Last Monday of May
    { month: 6, day: 4, name: "Independence Day" },
    { month: 8, day: 7, name: "Labor Day" }, // 1st Monday of September
    { month: 9, day: 31, name: "Halloween" },
    { month: 10, day: 11, name: "Veterans Day" },
    { month: 10, day: 26, name: "Thanksgiving" }, // 4th Thursday of November
    { month: 11, day: 25, name: "Christmas" },
    { month: 11, day: 31, name: "New Year's Eve" },
  ];

  const isHoliday = (day) => {
    return usHolidays.find(h => h.month === currentDate.getMonth() && h.day === day);
  };

  // Confetti effect
  const triggerConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];
    const newConfetti = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
      });
    }
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 3000);
  };
  
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  
  // Printing animation - using requestAnimationFrame for smooth 60fps
  useEffect(() => {
    if (isPrinting) {
      const duration = 4500; // 4.5 seconds total
      let startTime = null;
      let animationId = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const linearProgress = Math.min(elapsed / duration, 1);

        // Very slow start, then gradually speeds up
        const easedProgress = Math.pow(linearProgress, 3);
        setPrintProgress(easedProgress * 100);

        if (linearProgress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          setPrintProgress(100);
          setTimeout(() => setIsPrinting(false), 200);
        }
      };

      animationId = requestAnimationFrame(animate);

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
      };
    }
  }, [isPrinting]);
  
  const handleReprint = () => {
    setPrintProgress(0);
    setIsPrinting(true);
    setShowPrinter(true);
    setSelectedDate(null);
    setFortuneMessage(null);
  };
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };
  
  const formatPrice = (day) => {
    if (!day) return '';
    return `$${(day * 0.99).toFixed(2)}`;
  };
  
  const generateBarcode = () => {
    // Generate a realistic barcode pattern with varying bar widths
    const patterns = [
      [2,1,2,2,2,1], [2,2,2,1,2,1], [2,2,2,1,1,2], [1,2,1,2,2,2],
      [1,2,2,2,2,1], [1,1,2,2,2,2], [2,1,2,1,2,2], [2,1,2,2,1,2],
      [2,2,2,2,1,1], [1,1,1,3,2,2], [1,1,2,3,1,2], [1,2,1,3,1,2],
    ];

    const bars = [];
    // Extended code for more bars - repeat date info and add extra digits
    const baseCode = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${getDaysInMonth(currentDate)}`;
    const code = baseCode + baseCode.split('').reverse().join('') + '0123456789';

    // Start pattern
    bars.push({ width: 2, black: true });
    bars.push({ width: 1, black: false });
    bars.push({ width: 1, black: true });
    bars.push({ width: 1, black: false });

    // Generate bars based on date digits
    for (let i = 0; i < code.length; i++) {
      const digit = parseInt(code[i]);
      const pattern = patterns[digit % patterns.length];
      pattern.forEach((width, idx) => {
        bars.push({ width, black: idx % 2 === 0 });
      });
    }

    // End pattern
    bars.push({ width: 2, black: true });
    bars.push({ width: 1, black: false });
    bars.push({ width: 1, black: true });
    bars.push({ width: 2, black: false });
    bars.push({ width: 1, black: true });

    return bars;
  };

  const calendarDays = generateCalendarDays();
  const receiptHeight = 1200; // Height for full receipt including torn edge
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px 20px 40px',
      fontFamily: '"Courier New", Courier, monospace',
      overflow: 'hidden',
    }}>
      {/* Printer Housing */}
      <div style={{
        width: '400px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Printer Body */}
        <div style={{
          background: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%)',
          height: '80px',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Printer Label */}
          <div style={{
            color: '#888',
            fontSize: '10px',
            letterSpacing: '4px',
            position: 'absolute',
            top: '12px',
          }}>
            THERMAL-PRINT 3000
          </div>
          
          {/* Status Light */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '20px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isPrinting ? '#4ade80' : '#666',
            boxShadow: isPrinting ? '0 0 10px #4ade80' : 'none',
            animation: isPrinting ? 'blink 0.5s infinite' : 'none',
          }} />
          
          {/* Paper Slot */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            width: '360px',
            height: '12px',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
            borderRadius: '2px',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
            overflow: 'hidden',
          }}>
            {/* Paper Roll visible inside slot */}
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '320px',
              height: '20px',
              background: 'linear-gradient(180deg, #e8e5db 0%, #d4d1c7 50%, #c9c6bc 100%)',
              borderRadius: '50%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)',
            }} />
          </div>
        </div>
        
        {/* Receipt Container - clips the receipt */}
        <div style={{
          position: 'relative',
          height: isPrinting ? `${(printProgress / 100) * receiptHeight}px` : 'auto',
          overflow: 'hidden',
        }}>
          {/* Confetti */}
          {confetti.map(c => (
            <div
              key={c.id}
              style={{
                position: 'absolute',
                left: `${c.x}%`,
                top: '-20px',
                width: `${c.size}px`,
                height: `${c.size}px`,
                background: c.color,
                borderRadius: c.size > 6 ? '2px' : '50%',
                transform: `rotate(${c.rotation}deg)`,
                animation: `confettiFall 2.5s ease-out ${c.delay}s forwards`,
                zIndex: 100,
              }}
            />
          ))}

          {/* The Receipt */}
          <div
            style={{
              background: '#f5f2e8',
              width: '340px',
              margin: '0 auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.1)',
              position: 'relative',
              borderRadius: '0 0 2px 2px',
              transform: isPrinting
                ? `translateY(${-receiptHeight + (printProgress / 100) * receiptHeight}px)`
                : 'translateY(0)',
            }}
          >
            {/* Paper texture overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.08,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
                mixBlendMode: 'multiply',
              }}
            />
        
        <div style={{ padding: '20px 24px' }}>
          {/* Store header */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              letterSpacing: '8px',
              color: '#1a1a1a',
              marginBottom: '4px',
            }}>
              CALENDAR
            </div>
            <div style={{
              fontSize: '10px',
              letterSpacing: '3px',
              color: '#666',
            }}>
              ★ TIME & DATE EMPORIUM ★
            </div>
            <div style={{
              fontSize: '9px',
              color: '#888',
              marginTop: '4px',
            }}>
              123 TEMPORAL AVE, CHRONOS CITY
            </div>
            <div style={{
              fontSize: '9px',
              color: '#888',
            }}>
              TEL: (555) TIME-FLY
            </div>
          </div>
          
          {/* Divider */}
          <div style={{
            borderTop: '2px dashed #333',
            margin: '16px 0',
          }} />
          
          {/* Transaction info */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#444',
            marginBottom: '8px',
          }}>
            <span>TRX #00{currentDate.getMonth() + 1}{currentDate.getFullYear()}</span>
            <span>CASHIER: yanliudesign</span>
          </div>
          
          {/* Date/Time */}
          <div style={{
            fontSize: '11px',
            color: '#444',
            marginBottom: '16px',
          }}>
            <div>DATE: {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}</div>
            <div>TIME: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          
          {/* Divider */}
          <div style={{
            borderTop: '1px solid #ddd',
            margin: '12px 0',
          }} />
          
          {/* Month navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '8px 0',
            pointerEvents: isPrinting ? 'none' : 'auto',
            opacity: isPrinting ? 0.7 : 1,
          }}>
            <button
              onClick={prevMonth}
              style={{
                background: 'none',
                border: '1px solid #333',
                padding: '4px 12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                color: '#333',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#333';
                e.target.style.color = '#f5f2e8';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#333';
              }}
            >
              {'<<'}
            </button>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              letterSpacing: '4px',
              color: '#1a1a1a',
            }}>
              {months[currentDate.getMonth()]} '{currentDate.getFullYear().toString().slice(-2)}
            </div>
            <button
              onClick={nextMonth}
              style={{
                background: 'none',
                border: '1px solid #333',
                padding: '4px 12px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '14px',
                color: '#333',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#333';
                e.target.style.color = '#f5f2e8';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = '#333';
              }}
            >
              {'>>'}
            </button>
          </div>
          
          {/* Column headers like receipt items */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#666',
            borderBottom: '1px dashed #999',
            paddingBottom: '4px',
            marginBottom: '8px',
          }}>
            <span>ITEM</span>
            <span>QTY</span>
            <span>PRICE</span>
          </div>
          
          {/* Day headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            marginBottom: '8px',
          }}>
            {days.map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: day === 'SU' || day === 'SA' ? '#999' : '#333',
                  padding: '4px 0',
                }}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            pointerEvents: isPrinting ? 'none' : 'auto',
          }}>
            {calendarDays.map((day, index) => {
              const holiday = isHoliday(day);
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (day) {
                      setSelectedDate(day);
                      setFortuneMessage(null);
                      if (holiday) triggerConfetti();
                    }
                  }}
                  style={{
                    textAlign: 'center',
                    padding: '8px 2px',
                    cursor: day ? 'pointer' : 'default',
                    position: 'relative',
                    background: isToday(day)
                      ? '#1a1a1a'
                      : holiday
                        ? '#fff3e0'
                        : selectedDate === day
                          ? '#e0ddd3'
                          : 'transparent',
                    color: isToday(day)
                      ? '#f5f2e8'
                      : holiday
                        ? '#e65100'
                        : day
                          ? '#333'
                          : 'transparent',
                    transition: 'all 0.15s',
                    borderRadius: '2px',
                    border: holiday ? '1px dashed #ffab40' : 'none',
                  }}
                  onMouseOver={(e) => {
                    if (day && !isToday(day)) {
                      e.currentTarget.style.background = holiday ? '#ffe0b2' : '#e8e5db';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (day && !isToday(day) && selectedDate !== day) {
                      e.currentTarget.style.background = holiday ? '#fff3e0' : 'transparent';
                    }
                  }}
                  title={holiday ? holiday.name : ''}
                >
                  <div style={{
                    fontSize: '14px',
                    fontWeight: isToday(day) || holiday ? 'bold' : 'normal',
                  }}>
                    {day ? day.toString().padStart(2, '0') : ''}
                  </div>
                  {day && (
                    <div style={{
                      fontSize: '8px',
                      color: isToday(day) ? '#aaa' : holiday ? '#ff8a65' : '#999',
                      marginTop: '2px',
                    }}>
                      {holiday ? '★' : formatPrice(day)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Divider */}
          <div style={{
            borderTop: '1px dashed #999',
            margin: '16px 0 12px',
          }} />
          
          {/* Subtotal area */}
          <div style={{
            fontSize: '11px',
            color: '#444',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}>
              <span>DAYS THIS MONTH:</span>
              <span>{getDaysInMonth(currentDate)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}>
              <span>WEEKENDS:</span>
              <span>{Math.floor(getDaysInMonth(currentDate) / 7) * 2 + (getDaysInMonth(currentDate) % 7 > 0 ? 1 : 0)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}>
              <span>WEEKS:</span>
              <span>{Math.ceil((getDaysInMonth(currentDate) + getFirstDayOfMonth(currentDate)) / 7)}</span>
            </div>
          </div>
          
          {/* Divider */}
          <div style={{
            borderTop: '2px solid #333',
            margin: '12px 0',
          }} />
          
          {/* Total */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '8px',
          }}>
            <span>TOTAL DAYS:</span>
            <span>{getDaysInMonth(currentDate)}</span>
          </div>
          
          {selectedDate && (() => {
            const selectedHoliday = isHoliday(selectedDate);
            return (
              <div style={{
                background: selectedHoliday ? '#fff3e0' : '#e8e5db',
                padding: '12px',
                marginTop: '12px',
                border: selectedHoliday ? '2px dashed #ffab40' : '1px dashed #999',
              }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                  SELECTED ITEM:
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {months[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
                </div>
                {selectedHoliday && (
                  <div style={{
                    fontSize: '12px',
                    color: '#e65100',
                    marginTop: '6px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                  }}>
                    {selectedHoliday.name.toUpperCase()}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                  UNIT PRICE: {formatPrice(selectedDate)}
                </div>
              </div>
            );
          })()}
          
          {/* Barcode */}
          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onClick={revealFortune}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Click for a fortune!"
          >
            <svg
              width="100%"
              height="50"
              viewBox="0 0 292 50"
              preserveAspectRatio="none"
              style={{ display: 'block' }}
            >
              {(() => {
                const bars = generateBarcode();
                // Calculate scale to fill the width
                const totalUnits = bars.reduce((sum, bar) => sum + bar.width, 0);
                const availableWidth = 280;
                const unitWidth = availableWidth / totalUnits;
                let x = 6;
                return bars.map((bar, i) => {
                  const width = bar.width * unitWidth;
                  const rect = bar.black ? (
                    <rect
                      key={i}
                      x={x}
                      y="5"
                      width={width * 0.65}
                      height="40"
                      fill="#1a1a1a"
                    />
                  ) : null;
                  x += width;
                  return rect;
                });
              })()}
            </svg>
            <div style={{
              fontSize: '12px',
              color: '#333',
              marginTop: '2px',
              letterSpacing: '8px',
              fontWeight: '500',
            }}>
              {currentDate.getFullYear()}{(currentDate.getMonth() + 1).toString().padStart(2, '0')}{getDaysInMonth(currentDate)}
            </div>
          </div>

          {/* Fortune Message */}
          {fortuneMessage && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
              border: '1px dashed #d4a574',
              borderRadius: '4px',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              <div style={{
                fontSize: '9px',
                color: '#a67c52',
                letterSpacing: '2px',
                marginBottom: '6px',
              }}>
                YOUR FORTUNE
              </div>
              <div style={{
                fontSize: '11px',
                color: '#5c4033',
                fontStyle: 'italic',
                lineHeight: '1.5',
              }}>
                "{fortuneMessage}"
              </div>
            </div>
          )}
          
          {/* Footer messages */}
          <div style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '10px',
            color: '#888',
            lineHeight: '1.6',
          }}>
            <div>- - - - - - - - - - - - - - - -</div>
            <div style={{ margin: '8px 0' }}>
              THANK YOU FOR YOUR TIME!
            </div>
            <div>PLEASE COME AGAIN</div>
            <div style={{ marginTop: '8px', fontSize: '9px' }}>
              *** NO REFUNDS ON TIME ***
            </div>
            <div style={{ marginTop: '4px', fontSize: '9px' }}>
              CUSTOMER COPY
            </div>
          </div>
        </div>
        
        {/* Torn paper edge bottom */}
        <div style={{
          height: '16px',
          background: '#f5f2e8',
          clipPath: 'polygon(0% 0%, 2% 50%, 4% 0%, 6% 60%, 8% 0%, 10% 40%, 12% 0%, 14% 70%, 16% 0%, 18% 50%, 20% 0%, 22% 55%, 24% 0%, 26% 40%, 28% 0%, 30% 65%, 32% 0%, 34% 45%, 36% 0%, 38% 60%, 40% 0%, 42% 35%, 44% 0%, 46% 55%, 48% 0%, 50% 50%, 52% 0%, 54% 65%, 56% 0%, 58% 40%, 60% 0%, 62% 60%, 64% 0%, 66% 45%, 68% 0%, 70% 55%, 72% 0%, 74% 35%, 76% 0%, 78% 65%, 80% 0%, 82% 50%, 84% 0%, 86% 60%, 88% 0%, 90% 40%, 92% 0%, 94% 55%, 96% 0%, 98% 45%, 100% 0%)',
        }} />
        
        {/* Paper curl shadow */}
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          height: '20px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
          </div>
        </div>
      </div>
      
      {/* Print Again Button */}
      {!isPrinting && (
        <button
          onClick={handleReprint}
          style={{
            marginTop: '24px',
            background: 'none',
            border: '2px solid #666',
            color: '#888',
            padding: '12px 32px',
            fontFamily: 'inherit',
            fontSize: '12px',
            letterSpacing: '4px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            borderRadius: '4px',
          }}
          onMouseOver={(e) => {
            e.target.style.borderColor = '#f5f2e8';
            e.target.style.color = '#f5f2e8';
          }}
          onMouseOut={(e) => {
            e.target.style.borderColor = '#666';
            e.target.style.color = '#888';
          }}
        >
          🖨️ PRINT AGAIN
        </button>
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(800px) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptCalendar;
