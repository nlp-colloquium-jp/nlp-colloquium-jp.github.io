const now = new Date();

async function fetchTalks() {
    try {
        const response = await fetch("/api/schedule.json");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const talks = await response.json();
        return talks.talks;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

function getNextTalk(talks) {
    let closestTalk = null;
    let closestTimeDiff = Infinity;
  
    talks.forEach(talk => {
        const talkDate = new Date(talk.time_end);
        if (talkDate > now) {
            const timeDiff = talkDate - now;
            if (timeDiff < closestTimeDiff) {
                closestTimeDiff = timeDiff;
                closestTalk = talk;
            }
        }
    });
  
    return closestTalk;
}

function checkIfOngoing(talk) {
    const startDate = new Date(talk.date);
    const endDate = new Date(talk.time_end);
    return (startDate <= now & now <= endDate)? true: false;
}

function prepareNameColumn(name, name_en, website) {
    const name_str = name_en ? `${name} / ${name_en}` : name;
    if (website) {
        return `<a href=${website}>${name_str}</a>`
    } else {
        return name_str
    }
}
  
async function displayClosestTalk() {
    const talks = await fetchTalks();
    const closestTalk = getNextTalk(talks);
    const nextTalkDiv = document.getElementById('next-talk');
  
    if (closestTalk) {
        const date = new Date(closestTalk.date);
        const date_str = new Intl.DateTimeFormat("ja-JP", {
            month: 'long',
            day: 'numeric',
            weekday: "short",
            hour: "numeric",
            minute: "numeric"
        }).format(date);
        const end_date = new Date(closestTalk.time_end);
        const end_date_str = new Intl.DateTimeFormat("ja-JP", {
            hour: "numeric",
            minute: "numeric"
        }).format(end_date);
        const tz = new Intl.DateTimeFormat("ja-JP", {
            timeZoneName: "shortGeneric"
        }).formatToParts(date).find(part => part.type === 'timeZoneName').value;
        console.log(date_str);
        const name = prepareNameColumn(closestTalk.name, closestTalk.name_en, closestTalk.website)
        // If there's a notice field, render it in bold below the details
        const notice_html = closestTalk.notice ? `<p style="text-align:center;font-weight:700"><strong>${closestTalk.notice}</strong></p>` : '';
        if (checkIfOngoing(closestTalk)) {
            nextTalkDiv.classList.add("bd-callout", "bd-callout-themecolor");
            nextTalkDiv.innerHTML = `
            <p>現在下記のトークを開催中です！${date_str} ~ ${end_date_str} (${tz})</p>
            <dl class="row mb-1" style="margin-bottom: 0px;">
                <dt class="col-sm-2 mb-1">スピーカー</dt>
                <dd class="col-sm-10 mb-1">${name}</dd>
                <dt class="col-sm-2 mb-1">トピック</dt>
                <dd class="col-sm-10 mb-1"><a href=${closestTalk.talk_url}>${closestTalk.topic}</a></dd>
            </dl>
            ${notice_html}`;
                
        } else {
            nextTalkDiv.classList.add("bd-callout", "bd-callout-default");
            nextTalkDiv.innerHTML = `
            <p>次回のトークは ${date_str} (${tz}) より開始予定です。</p>
            <dl class="row mb-1" style="margin-bottom: 0px;">
                <dt class="col-sm-2 mb-1">スピーカー</dt>
                <dd class="col-sm-10 mb-1">${name}</dd>
                <dt class="col-sm-2 mb-1">トピック</dt>
                <dd class="col-sm-10 mb-1"><a href=${closestTalk.talk_url}>${closestTalk.topic}</a></dd>
            </dl>
            ${notice_html}`;
        }
    } else {
        nextTalkDiv.innerHTML = '';
    }
}
  
displayClosestTalk();
