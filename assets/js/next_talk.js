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
    const now = new Date();
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
            minute: "numeric",
            timeZoneName: "short",
            timeZone: closestTalk.timezone
        }).format(date);
        console.log(date_str);

        const name = prepareNameColumn(closestTalk.name, closestTalk.name_en, closestTalk.website)

        nextTalkDiv.classList.add("bd-callout", "bd-callout-default");
        nextTalkDiv.innerHTML = `
        <p>次回のトークは ${date_str} より開始予定です。</p>
        <dl class="row mb-1" style="margin-bottom: 0px;">
            <dt class="col-sm-2 mb-1">スピーカー</dt>
            <dd class="col-sm-10 mb-1">${name}</dd>
            <dt class="col-sm-2 mb-1">トピック</dt>
            <dd class="col-sm-10 mb-1"><a href=${closestTalk.talk_url}>${closestTalk.topic}</a></dd>
        </dl>`;
        
    } else {
        nextTalkDiv.innerHTML = '';
    }
}
  
displayClosestTalk();
