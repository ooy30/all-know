export const listDataSearch = Object.freeze({
  data: [
    // { value: 1, label: 'ค้นหาโครงการ ระยะะ 20 ก.ม. รอบตัว', placeholder: 'ระบุชื่อโครงการ CoST' },
    // // { value: 2, label: 'ค้นหาโครงการ ระยะะ 15 ก.ม. รอบตัว', placeholder: 'ระบุเลขที่ CoST' },
    // // { value: 3, label: 'ค้นหาโครงการ ระยะะ 10 ก.ม. รอบตัว', placeholder: 'ระบุเลขที่โครงการ CoST' },
    {
      value: 1,
      label: 'ค้นหาโครงการ ระยะะ 10, 15, 20 ก.ม. รอบตัว',
      placeholder: 'โปรดเลือก',
    },
    { value: 2, label: 'ค้นหาโครงการ ทั่วประเทศ', placeholder: 'โปรดเลือก' },
    { value: 3, label: 'ค้นหาโครงการ ตามภาค', placeholder: 'โปรดเลือก' },
    { value: 4, label: 'ค้นหาโครงการ ตามจังหวัด', placeholder: 'โปรดเลือก' },
  ]
})

export const colorMap = Object.freeze({
  data: [
    '#fff',
    '#52c41a',
    '#faad14',
    '#096dd9',
    '#dc3545',
    '#6e0089',
    '#ff2975',
  ]
})

export const dataListDistance = Object.freeze({
  data: [
    { name: 'ระยะะ 10 ก.ม. รอบตัว', value: 10 },
    { name: 'ระยะะ 15 ก.ม. รอบตัว', value: 15 },
    { name: 'ระยะะ 20 ก.ม. รอบตัว', value: 20 },
  ]
})

export const listDataRegionCode = Object.freeze({
  data: [
    {
      value: 1,
      label: 'ภาคเหนือ',
      lat: 18.99102,
      long: 99.569008,
    },
    {
      value: 2,
      label: 'ภาคตะวันออก',
      lat: 13.149505,
      long: 101.72858,
    },
    {
      value: 3,
      label: 'ภาคตะวันออกเฉียงเหนือ',
      lat: 16.386823,
      long: 103.350473,
    },
    {
      value: 4,
      label: 'ภาคกลาง',
      lat: 15.884244,
      long: 100.908914,
    },
    {
      value: 5,
      label: 'ภาคตะวันตก',
      lat: 13.465499,
      long: 99.408221,
    },
    {
      value: 6,
      label: 'ภาคใต้',
      lat: 8.839673,
      long: 98.809968,
    }
  ]
})
