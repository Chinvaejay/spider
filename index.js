const pup = require('puppeteer')

let url = `https://cloud.tencent.com/act/seckill`
async function main () {
    let browser = await pup.launch({
        ignoreDefaultArgs: true,
        headless: false,
        ignoreHTTPSErrors: true,
        devtools: true,
        defaultViewport: {
            width: 1370,
            height: 1080,
        }
    })

    let page = await browser.newPage()
    await page.goto(url)
    // 等待页面渲染完成
    await page.waitForSelector('.act-segment-btn.act-segment-btn-active')
    console.log('页面渲染完成')


    // 获取tab按钮
    // let actTimelineItems = await page.$$('.act-timeline-item')
    // for (let i = 0; i < actTimelineItems.length; i ++) {
    //     let isDisabled = await actTimelineItems[i].evaluate(el => el.classList.contains('act-timeline-item-done'))
    //     // 如果被禁用了，就不点击了
    //     if (isDisabled) {
    //         continue;
    //     }
    //     await actTimelineItems[i].click()
    //     // 获取要爬取的元素
    //     let actLatticeCells = await page.$$('.act-lattice-cell')
    //     for (let j = 0; j < actLatticeCells.length; j ++) {
    //         // 获取标题 产品类型
    //         let title = await actLatticeCells[j].$eval('.act-card1-tit.act-card1-tit-pc', el => el.innerText)
    //         // 获取描述
    //         let desc = await actLatticeCells[j].$eval('.act-card1-sub-tit.act-card1-sub-tit-pc', el => el.innerText)
    //         // 获取配置
    //         let options = await actLatticeCells[j].$eval('.act-card1-features.act-card1-features-pc', el => el.innerText)
    //         // 活动价
    //         let price = await actLatticeCells[j].$eval('.act-card1-prices', el => el.innerText)
    //         // 原价
    //         let old = await actLatticeCells[j].$eval('.act-card1-original-price', el => el.innerText)

    //         let txt = `${title},${desc},${options},${price},${old}`.replace(/\n/g, '\t')
    //         console.log(txt)
    //     }

    // }
    
    // 获取act-product-panel1
    let actProductPanel1s = await page.$$('.act-product-panel1')
    for (let i = 0; i < actProductPanel1s.length; i ++) {
        
        // 获取标题 产品类型
        let title = await actProductPanel1s[i].$eval('.act-p-panel-header1-tit', el => el.innerText)
        // 获取要爬取的元素
        let actProductBarBase1s = await actProductPanel1s[i].$$('.act-product-bar-base1.act-product-bar1')
        for (let j = 0; j < actProductBarBase1s.length; j ++) {

            // 获取描述
            let desc = await actProductBarBase1s[j].$eval('.act-product-bar-base1-lt-tit-span', el => el.innerText)
            // 获取配置
            // 这里的配置是可选的 不同配置对应不同价格
            let opt1 = await actProductBarBase1s[j].$('.act-product-bar-base1-opt1')
            // 配置1名称
            let opt1Name = await opt1.$eval('.act-product-bar-base1-label', el => el.innerText)
            let opt1Opts = await opt1.$$('.act-dropdown-menu-item')
            for (let k = 0; k < opt1Opts.length; k ++) {
                // 点击下拉框
                await (await opt1.$('.act-select-btn')).click()
                await opt1Opts[k].click()

                // 获取第二选项
                let opt2 = await actProductBarBase1s[j].$('.act-product-bar-base1-opt2')
                // 配置2名称
                let opt2Name = await opt2.$eval('.act-product-bar-base1-label', el => el.innerText)
                let opt2Opts = await opt2.$$('.act-dropdown-menu-item')
                for (let l = 0; l < opt2Opts.length; l ++) {
                    // 点击下拉框
                    await (await opt2.$('.act-select-btn')).click()
                    await opt2Opts[l].click()
                    // 获取第三选项
                    let opt3 = await actProductBarBase1s[j].$('.act-product-bar-base1-opt3')
                    // 配置3名称
                    let opt3Name = await opt3.$eval('.act-product-bar-base1-label', el => el.innerText)
                    let opt3Opts = await opt3.$$('.act-segment-btn')
                    for (let m = 0; m < opt3Opts.length; m ++) {
                        // 点击下拉框
                        await opt3Opts[m].click()
                        // 等待价格接口
                        let api = '/act/common/ajax/dianshi'
                        await page.waitForResponse(res => {
                            return res.request().url().includes(api) && res.ok()
                        })
                        await page.waitForSelector('.act-product-bar-base1-price-original')
                        
                        // 配置值
                        let opt1Value = await actProductBarBase1s[j].$eval('.act-product-bar-base1-opt1 .act-select-btn', el => el.innerText)
                        let opt2Value = await actProductBarBase1s[j].$eval('.act-product-bar-base1-opt2 .act-select-btn', el => el.innerText)
                        let opt3Value = await opt3Opts[m].evaluate(el => el.innerText)
                        
                        let options = `${opt1Name}-${opt1Value}\t${opt2Name}-${opt2Value}\t${opt3Name}-${opt3Value}`
                        // 活动价
                        let price = await actProductBarBase1s[j].$eval('.act-product-bar-base1-price', el => el.innerText)
                        // 原价
                        let old = await actProductBarBase1s[j].$eval('.act-product-bar-base1-price-original', el => el.innerText)
            
                        let txt = `${title},${desc},${options},${price},${old}`.replace(/\n/g, '\t')
                        console.log(txt)
                    }
                }

            }
        }

    }


    // page.close()
}
main()