    this.basicData = {
      labels: ['กรมแรงงาน', 'กรมจัดหางาน', 'กรมสวัสดิการ', 'กรมประกันสังคม','ระบบ'],
      datasets: [
          {
              label: 'คำร้องทั้งหมด',
              backgroundColor: '#42A5F5',
              data: [65, 59, 80, 81, 56]
          },
          {
              label: 'เสร็จสิ้น',
              backgroundColor: '#4caf50',
              data: [28, 48, 40, 19, 8]
          },
          {
              label: 'กำลังดำเดินการ',
              backgroundColor: '#fbc02d',
              data: [28, 48, 40, 19, 86]
          },
          {
              label: 'รอดำเนินการ',
              backgroundColor: '#ff0000',
              data: [28, 48, 40, 19, 86]
          }
      ]
  };

  this.basicOptions = {
    plugins: {
        legend: {
            labels: {
                color: '#6c757d'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#6c757d'
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
            }
        },
        y: {
            ticks: {
                color: '#6c757d'
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
            }
        }
    }
};
