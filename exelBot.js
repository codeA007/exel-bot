const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

const websites = [
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/overview/',
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/rooms/',
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/photos/',
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/dining/',
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/events/',
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/experiences/',
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/Design/',
    'https://www.marriott.com/en-us/hotels/mlexr-the-st-regis-maldives-vommuli-resort/own/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/overview/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/rooms/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/photos/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/dining/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/events/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/experiences/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/Design/',
    'https://www.marriott.com/en-us/hotels/nycmq-new-york-marriott-marquis/own/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/overview/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/rooms/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/photos/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/dining/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/events/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/experiences/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/Design/',
    'https://www.marriott.com/en-us/hotels/mcosv-sheraton-vistana-resort-villas-lake-buena-vista-orlando/own/',
    'https://www.ritzcarlton.com/en/hotels//blrrz-the-ritz-carlton-bangalore/overview/',
    'https://www.ritzcarlton.com/en/hotels//blrrz-the-ritz-carlton-bangalore/photos/',
    'https://www.ritzcarlton.com/en/hotels//blrrz-the-ritz-carlton-bangalore/dining/',
    'https://www.ritzcarlton.com/en/hotels//blrrz-the-ritz-carlton-bangalore/events/',
    'https://www.ritzcarlton.com/en/hotels//blrrz-the-ritz-carlton-bangalore/experiences/',
    'https://www.ritzcarlton.com/en/hotels/sjdzr-zadun-a-ritz-carlton-reserve/overview/',
    'https://www.ritzcarlton.com/en/hotels/sjdzr-zadun-a-ritz-carlton-reserve/photos/',
    'https://www.ritzcarlton.com/en/hotels/sjdzr-zadun-a-ritz-carlton-reserve/dining/',
    'https://www.ritzcarlton.com/en/hotels/sjdzr-zadun-a-ritz-carlton-reserve/events/',
    'https://www.ritzcarlton.com/en/hotels/sjdzr-zadun-a-ritz-carlton-reserveexperiences/',
];

(async () => {
    console.time('Total Process Time');
    const browser = await puppeteer.launch({ headless: false ,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        protocolTimeout: 300000 
    });
    const page = await browser.newPage();
    const results = [];
    var deskTopMode = false;

    const analyzeSite = async (site, device) => {
        try {
            if (deskTopMode == false) {
                console.log(deskTopMode);
                await page.goto('https://pagespeed.web.dev/', { waitUntil: 'networkidle2', timeout: 120000 });
                await page.waitForSelector('input[type="text"]', { timeout: 60000 });
                await page.type('input[type="text"]', site);

                await page.waitForSelector('button', { timeout: 60000 });
                const buttons = await page.$$('button');
                for (const button of buttons) {
                    const text = await page.evaluate(el => el.textContent, button);
                    if (text.trim() === 'Analyze') {
                        await button.click();
                        break;
                    }
                }
            }

            if(deskTopMode==false){
                await page.waitForFunction(() => {
                    const imgs = Array.from(document.querySelectorAll('img[src="https://www.gstatic.com/pagespeed/insights/ui/img/icon-lab.svg"]'));
                    return imgs.length >= 2;
                }, { timeout: 240000});
            }

            // Get all second child span values which have a parent span with text "75th Percentile - "
            let percentileValues = await page.evaluate(() => {
                const spans = Array.from(document.querySelectorAll('span'));
                      return spans
                    .map(span => span.textContent)
                    .filter(text => text.includes('75th Percentile - ') && text.length <= 26)
                    .map(text => text.substring(17)); // Remove the first 17 characters
            });

            // const element = document.querySelector('div > div > div > div:nth-child(4) > div > div > div:nth-child(2) > span > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(2) > div > div:nth-child(3) > div > div > span > span > span');

// Check if the element exists
// if (element) {
//     // Log the text content of the selected element to the console
//     console.log(element.textContent);

//     // Add the text content of the selected element to the percentileValues array
//     percentileValues.push(element.textContent);
// } else {
//     console.log('Element not found');
// }
            // console.log(`Span values (after removing first 17 characters) containing "75th Percentile - " and ending with " s" or " ms" and length <= 25 for ${site}`, percentileValuesDesktop);
            // const [lcpUser, inp, fcpUser, ttfb] = percentileValuesDesktop;

// Log the selected element to the console
            // console.log(`Span values (after removing first 17 characters) containing "75th Percentile - " and ending with " s" or " ms" and length <= 25 for ${site} on ${device}:`, percentileValues);
            console.log(percentileValues);
            
            if(deskTopMode==true){
                if (percentileValues.length <= 11) {
                    percentileValues = percentileValues.slice(-5);
                    console.log(percentileValues);
                }
                else{
                    percentileValues=percentileValues.slice(10,15)
                    console.log(percentileValues+'desktop');
                }
            }
            else{
                percentileValues=percentileValues.slice(0,5)
                console.log(percentileValues+"mobile");
                
            }
            const [lcpUser, inp,clsUser, fcpUser, ttfb] = percentileValues;

            const performanceData = await page.evaluate(() => {
                const getTextContent = (selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.innerText : 'N/A';
                };

                const getMetricValue = (metricName) => {
                    const metricElement = Array.from(document.querySelectorAll('.lh-metric__title'))
                        .find(el => el.textContent.includes(metricName));
                    return metricElement ? metricElement.closest('.lh-metric').querySelector('.lh-metric__value').innerText : 'N/A';
                };

                const performanceScore = getTextContent('.lh-gauge__percentage');
                const lcp = getMetricValue('Largest Contentful Paint');
                const cls = getMetricValue('Cumulative Layout Shift');
                const fcp = getMetricValue('First Contentful Paint');
                const tbt = getMetricValue('Total Blocking Time');
                const speedIndex = getMetricValue('Speed Index');

                const getCategoryScore = (categoryName) => {
                    const categoryElement = Array.from(document.querySelectorAll('.lh-category-header'))
                        .find(el => el.textContent.includes(categoryName));
                    return categoryElement ? categoryElement.querySelector('.lh-gauge__percentage').innerText : 'N/A';
                };

                const accessibility = getCategoryScore('Accessibility');
                const bestPractices = getCategoryScore('Best Practices');
                const seo = getCategoryScore('SEO');

                return {
                    performanceScore,
                    lcp,
                    cls,
                    fcp,
                    tbt,
                    speedIndex,
                    accessibility,
                    bestPractices,
                    seo
                };
            });

            // console.log(`Performance Data for ${site} on ${device}:`, performanceData);
            if (deskTopMode == true) {
                
                await page.waitForFunction(() => {
                    const imgs = Array.from(document.querySelectorAll('img[src="https://www.gstatic.com/pagespeed/insights/ui/img/icon-lab.svg"]'));
                    return imgs.length >= 2;
                }, { timeout: 120000 });
                const { metricValues, gaugePercentages } = await page.evaluate(() => {
                    const metricValues = [];
                    const gaugePercentages = [];
                    const secondArticle = document.querySelectorAll('article')[1];
                    if (secondArticle) {
                        secondArticle.querySelectorAll('.lh-metric__value').forEach((element) => {
                            metricValues.push(element.innerText);
                        });
                        secondArticle.querySelectorAll('.lh-gauge__percentage').forEach((element) => {
                            gaugePercentages.push(element.innerText);
                        });
                    }
                    return {
                        metricValues,
                        gaugePercentages: gaugePercentages.slice(0, 4) 
                    };
                });
                [fcpD,lcpD,tbtD,clsD,siD]=metricValues;
                [perD,accD,bestD,seoD] = gaugePercentages
                // console.log('Metric Values:', metricValues);
                // console.log('First Four Gauge Percentages:', gaugePercentages);              
            }

            results.push({
                website: site,
                device: device,
                lcpUser: lcpUser || 'N/A',
                inp: inp || 'N/A',
                clsUser:clsUser||'N/A',
                fcpUser: fcpUser || 'N/A',
                ttfb: ttfb || 'N/A',
                performanceScore:(deskTopMode)?perD: performanceData.performanceScore,
                accessibility:(deskTopMode)?accD: performanceData.accessibility,
                bestPractices:(deskTopMode)?bestD: performanceData.bestPractices,
                seo:(deskTopMode) ? seoD : performanceData.seo,
                lcp:(deskTopMode)?lcpD: performanceData.lcp,
                cls: (deskTopMode)? clsD: performanceData.cls,
                fcp: (deskTopMode)?fcpD:performanceData.fcp,
                tbt:(deskTopMode)?tbtD: performanceData.tbt,
                speedIndex:(deskTopMode)?siD: performanceData.speedIndex,
            });
            console.log(results);
            
        } catch (error) {
            console.error(`Error processing ${site} on ${device}:`, error);
        }
        deskTopMode = false;
    };

    for (const site of websites) {
        // Analyze for mobile
        await analyzeSite(site, 'mobile');

        setTimeout(()=>{},2000)
        const spans = await page.$$('span');
        for (const span of spans) {
            const text = await page.evaluate(el => el.textContent, span);
            await page.waitForSelector('span');
            if (text.trim() === 'Desktop') {
                await span.click();
                deskTopMode = true;
                await analyzeSite(site, 'desktop');
            }
        }
    }

    await browser.close();

    // Step 3: Create Excel File
    const wb = xlsx.utils.book_new();
    const wsData = [['Website', 'Device','Date', 'LCPUser', 'INP','CLSUser','FCPUser','TTFB','Performance','Accessibility', 'Best Practices', 'SEO', 'FCP', 'LCP','TBT', 'CLS', 'Speed Index', ]];
    results.forEach(result => {
        wsData.push([
            result.website,
            result.device,
            new Date().toLocaleString(),
            result.lcpUser,
            result.inp,
            result.clsUser,
            result.fcpUser,
            result.ttfb,
            result.performanceScore,
            result.accessibility,
            result.bestPractices,
            result.seo,
            result.fcp,
            result.lcp,
            result.tbt,
            result.cls,
            result.speedIndex,
        ]);
    });
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'PageSpeed Results');
    xlsx.writeFile(wb, 'PageSpeedResults.xlsx');

    console.log('Excel file created: PageSpeedResults.xlsx');
    console.log('Abhishek sawkar');
    
    console.timeEnd('Total Process Time');
})();