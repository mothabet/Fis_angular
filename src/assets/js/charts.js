$(document).ready(function () {
    function chart1() {

        const ctx1 = document.getElementById('myChart1').getContext('2d');
        const myChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['النفط والغاز', 'الصناعة', 'الزراعة', 'التعليم', 'الصحة', 'السياحة', 'العقارات'].reverse(), // Right-to-left labels
                datasets: [{
                    yAxisID: 'first',
                    label: 'مكتملة',
                    barThickness: 20,
                    data: [85, 90, 54, 33, 29, 12, 18].reverse(),
                    backgroundColor: '#8DC63F',
                    borderRadius: 8,
                    stack: 'Stack 0'
                },
                {
                    yAxisID: 'first',
                    barThickness: 20,
                    label: 'غير مكتملة',
                    data: [63, 72, 38, 56, 28, 16, 14].reverse(),
                    backgroundColor: '#133C8B',
                    borderRadius: 8,
                    stack: 'Stack 0'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    first: {
                        position: 'right',
                        ticks:
                        {
                            beginAtZero: true,
                        },
                        grid: { display: true },
                        title: {
                            display: true,
                            text: 'السنوات'
                        }
                    },
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            useBorderRadius: true,
                            borderRadius: 5,
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    }
                }
            }
        });
    }
    function chart2() {

        const ctx = document.getElementById('myChart2').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['النفط والغاز', 'الصناعة', 'الزراعة', 'التعليم', 'الصحة', 'السياحة', 'العقارات'].reverse(), // Right-to-left labels
                datasets: [{
                    yAxisID: 'first',
                    barThickness: 20,
                    label: 'مكتملة',
                    data: [85, 90, 54, 33, 29, 12, 18].reverse(),
                    backgroundColor: '#8DC63F',
                    borderRadius: 8,
                    stack: 'Stack 0'
                },
                {
                    yAxisID: 'first',
                    barThickness: 20,
                    label: 'غير مكتملة',
                    data: [63, 72, 38, 56, 28, 16, 14].reverse(),
                    backgroundColor: '#F57F20',
                    borderRadius: 8,
                    stack: 'Stack 0'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    first: {
                        position: 'right',
                        ticks:
                        {
                            beginAtZero: true,
                        },
                        grid: { display: true },
                        title: {
                            display: true,
                            text: 'السنوات'
                        }
                    },
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            useBorderRadius: true,
                            borderRadius: 5,
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    }
                }
            }
        });
    }
    function chart3() {
        let refrenceId = $('#myChart3')
        var xValues = ['النفط والغاز', 'الصناعة', 'التعليم', 'الصحة'].reverse();
        new Chart(refrenceId, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    yAxisID: 'first',
                    data: [150000, 125000, 100000, 75000, 175000].reverse(),
                    borderColor: "#00AF9D",
                    borderWidth: 1,
                    label: 'شهر',
                    pointRadius: 5,
                    pointBorderColor: '#00AF9D',
                    pointBackgroundColor: '#00AF9D',
                    fill: true,
                    backgroundColor: '#F2FBFAb2'
                }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    first: {
                        position: 'right',
                        beginAtZero: true,
                        ticks:
                        {
                            min: 25000,
                            max: 175000,
                            stepSize: 25000,
                        },
                        grid: { display: true },
                    },
                },

                tooltips: {
                    enabled: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            useBorderRadius: true,
                            boxWidth: 0,
                            boxHeight: 0,
                        }

                    },

                },


            }

        });
    }
    function chart4() {

        const ctx = document.getElementById('myChart4').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['النفط', 'الصناعة', 'الزراعة', 'التعليم', 'الصحة'].reverse(), // Right-to-left labels
                datasets: [{
                    yAxisID: 'first',
                    barThickness: 15,
                    label: 'مكتملة',
                    data: [85, 90, 54, 33, 29].reverse(),
                    backgroundColor: '#F3C84E',
                    borderRadius: 8,
                    fill: true,
                    stack: 'Stack 0'
                },
                {
                    yAxisID: 'first',
                    barThickness: 15,
                    label: 'غير مكتملة',
                    data: [63, 72, 38, 56, 28].reverse(),
                    backgroundColor: '#133C8B',
                    borderRadius: 8,
                    fill: true,
                    stack: 'Stack 0'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    first: {
                        position: 'right',
                        ticks:
                        {
                            beginAtZero: true,
                            stepSize: 20,
                        },
                        grid: { display: true },
                        title: {
                            display: true,
                            text: 'السنوات'
                        }
                    },
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            useBorderRadius: true,
                            borderRadius: 5,
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    }
                }
            }
        });
    }
    function chart5() {

        const ctx = document.getElementById('myChart5').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['النفط والغاز', 'الصناعة', 'الزراعة', 'التعليم', 'الصحة', 'السياحة', 'العقارات'].reverse(), // Right-to-left labels
                datasets: [{
                    yAxisID: 'first',
                    barThickness: 20,
                    label: 'مكتملة',
                    data: [85, 90, 54, 33, 29, 12, 18].reverse(),
                    backgroundColor: '#7F3F98',
                    borderRadius: 8,
                    stack: 'Stack 0'
                },
                {
                    yAxisID: 'first',
                    barThickness: 20,
                    label: 'غير مكتملة',
                    data: [63, 72, 38, 56, 28, 16, 14].reverse(),
                    backgroundColor: '#C9CDD0',
                    borderRadius: 8,
                    stack: 'Stack 0'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    first: {
                        position: 'right',
                        ticks:
                        {
                            beginAtZero: true,
                        },
                        grid: { display: true },
                        title: {
                            display: true,
                            text: 'السنوات'
                        }
                    },
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            useBorderRadius: true,
                            borderRadius: 5,
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    }
                }
            }
        });
    }




    chart1()
    chart2()
    chart3()
    chart4()
    chart5()
})

