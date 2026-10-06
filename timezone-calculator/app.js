/**
 * Team Timezone Overlap Matrix & Golden Hour Finder
 * 100% Client-Side Engine powered by native Intl APIs
 */

(function () {
  'use strict';

  // Master Global Cities & Timezone Catalog
  const TIMEZONE_OPTIONS = [
    { label: 'San Francisco / Los Angeles (PST/PDT)', tz: 'America/Los_Angeles' },
    { label: 'Denver / Salt Lake (MST/MDT)', tz: 'America/Denver' },
    { label: 'Austin / Chicago (CST/CDT)', tz: 'America/Chicago' },
    { label: 'New York / Toronto (EST/EDT)', tz: 'America/New_York' },
    { label: 'São Paulo / Buenos Aires (BRT)', tz: 'America/Sao_Paulo' },
    { label: 'London / Dublin (GMT/BST)', tz: 'Europe/London' },
    { label: 'Berlin / Paris / Amsterdam (CET/CEST)', tz: 'Europe/Berlin' },
    { label: 'Athens / Cairo / Kyiv (EET/EEST)', tz: 'Europe/Athens' },
    { label: 'Dubai / Abu Dhabi (GST, UTC+4)', tz: 'Asia/Dubai' },
    { label: 'Bengaluru / Mumbai / Delhi (IST, UTC+5:30)', tz: 'Asia/Kolkata' },
    { label: 'Bangkok / Jakarta (ICT, UTC+7)', tz: 'Asia/Bangkok' },
    { label: 'Singapore / Hong Kong / Taipei (SGT, UTC+8)', tz: 'Asia/Singapore' },
    { label: 'Tokyo / Seoul (JST/KST, UTC+9)', tz: 'Asia/Tokyo' },
    { label: 'Sydney / Melbourne (AEST/AEDT)', tz: 'Australia/Sydney' },
    { label: 'Auckland / Wellington (NZST/NZDT)', tz: 'Pacific/Auckland' },
    { label: 'Honolulu (HST, UTC-10)', tz: 'Pacific/Honolulu' }
  ];

  // Default Demo Team
  const DEFAULT_MEMBERS = [
    { id: 'm1', name: 'Sarah (Design)', tz: 'America/Los_Angeles' },
    { id: 'm2', name: 'Marcus (Engineering)', tz: 'Europe/London' },
    { id: 'm3', name: 'Ananya (Product)', tz: 'Asia/Kolkata' },
    { id: 'm4', name: 'Kenji (DevOps)', tz: 'Asia/Tokyo' }
  ];

  let members = JSON.parse(JSON.stringify(DEFAULT_MEMBERS));
  let selectedUtcHour = 15; // Default: 15:00 UTC

  // Helper to format local hour for a timezone at a given UTC hour
  function getLocalTimeData(tz, utcHour) {
    try {
      const now = new Date();
      // Set to today's UTC hour
      const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, 0, 0));
      
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      });
      
      const hourFormatter24 = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false
      });

      const parts = formatter.formatToParts(utcDate);
      const tzName = (parts.find(p => p.type === 'timeZoneName') || {}).value || '';
      const localHour24 = parseInt(hourFormatter24.format(utcDate), 10);
      const formattedTime = formatter.format(utcDate);

      // Status classification
      let status = 'sleep'; // 9pm to 7am
      let score = 0;
      if (localHour24 >= 9 && localHour24 < 18) {
        status = 'work'; // 9am to 6pm
        score = 1.0;
      } else if ((localHour24 >= 7 && localHour24 < 9) || (localHour24 >= 18 && localHour24 < 21)) {
        status = 'shoulder'; // 7-9am or 6-9pm
        score = 0.5;
      }

      return {
        formattedTime,
        tzName,
        localHour24,
        status,
        score
      };
    } catch (e) {
      return {
        formattedTime: `${utcHour}:00`,
        tzName: 'UTC',
        localHour24: utcHour,
        status: 'work',
        score: 1.0
      };
    }
  }

  // Render Member Inputs
  function renderMembers() {
    const container = document.getElementById('membersList');
    if (!container) return;

    container.innerHTML = members.map((member, idx) => {
      const timeData = getLocalTimeData(member.tz, selectedUtcHour);
      
      const optionsHtml = TIMEZONE_OPTIONS.map(opt => `
        <option value="${opt.tz}" ${opt.tz === member.tz ? 'selected' : ''}>
          ${opt.label}
        </option>
      `).join('');

      return `
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all" data-member-id="${member.id}">
          <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
              #${idx + 1}
            </div>
            <input type="text" value="${member.name}" class="member-name-input px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56" placeholder="Member name or role" />
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <select class="member-tz-select px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs">
              ${optionsHtml}
            </select>

            <!-- Current status at selected sync hour -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusBadgeClass(timeData.status)} shrink-0">
              <span>${timeData.formattedTime}</span>
              <span class="text-[10px] uppercase opacity-75">(${timeData.status})</span>
            </div>

            ${members.length > 2 ? `
              <button type="button" class="remove-member-btn p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors" title="Remove member">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners to member inputs
    container.querySelectorAll('.member-name-input').forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        members[idx].name = e.target.value;
        updateCalculations();
      });
    });

    container.querySelectorAll('.member-tz-select').forEach((select, idx) => {
      select.addEventListener('change', (e) => {
        members[idx].tz = e.target.value;
        updateCalculations();
      });
    });

    container.querySelectorAll('.remove-member-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        members.splice(idx, 1);
        updateCalculations();
        renderMembers();
      });
    });
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'work':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
      case 'shoulder':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
      case 'sleep':
      default:
        return 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700';
    }
  }

  // Render 24-Hour Timeline Heatmap
  function renderHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;

    // Calculate overlap score for each UTC hour (0-23)
    const hourScores = [];
    for (let h = 0; h < 24; h++) {
      let totalScore = 0;
      members.forEach(m => {
        const data = getLocalTimeData(m.tz, h);
        totalScore += data.score;
      });
      hourScores.push({ hour: h, score: totalScore });
    }

    // Sort to find the highest scoring hours (Golden window)
    const maxScore = Math.max(...hourScores.map(s => s.score));
    const goldenHours = hourScores.filter(s => s.score === maxScore && s.score > 0).map(s => s.hour);

    // Header row: UTC hours
    let html = `
      <div class="grid grid-cols-[140px_repeat(24,1fr)] bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-500 select-none">
        <div class="p-2 border-r border-slate-200 dark:border-slate-800 flex items-center">Team Member</div>
        ${Array.from({ length: 24 }).map((_, h) => `
          <button type="button" class="utc-hour-col p-1.5 text-center font-mono hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors ${h === selectedUtcHour ? 'bg-blue-600 text-white font-bold' : ''}" data-utc="${h}" title="Select ${h}:00 UTC">
            ${h < 10 ? '0' + h : h}
          </button>
        `).join('')}
      </div>
    `;

    // Member rows
    members.forEach(member => {
      html += `
        <div class="grid grid-cols-[140px_repeat(24,1fr)] border-b border-slate-200/70 dark:border-slate-800/70 text-[11px] items-center">
          <div class="p-2 truncate font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800" title="${member.name}">
            ${member.name}
          </div>
          ${Array.from({ length: 24 }).map((_, h) => {
            const data = getLocalTimeData(member.tz, h);
            const isSelected = h === selectedUtcHour;
            let bgClass = 'bg-slate-200 dark:bg-slate-800 text-slate-400';
            if (data.status === 'work') bgClass = 'bg-emerald-500 text-white';
            else if (data.status === 'shoulder') bgClass = 'bg-amber-500 text-white';

            return `
              <div class="tz-hour-cell h-9 flex items-center justify-center font-mono text-[10px] cursor-pointer ${bgClass} ${isSelected ? 'ring-2 ring-blue-600 ring-inset z-20 font-bold' : 'border-r border-white/20 dark:border-slate-900/30'}" data-utc="${h}" title="${member.name}: ${data.formattedTime} (${data.status})">
                ${data.localHour24}
              </div>
            `;
          }).join('')}
        </div>
      `;
    });

    // Overlap summary row
    html += `
      <div class="grid grid-cols-[140px_repeat(24,1fr)] bg-slate-50 dark:bg-slate-900/80 text-[10px] font-bold text-slate-600 dark:text-slate-400">
        <div class="p-2 border-r border-slate-200 dark:border-slate-800 flex items-center">Overlap Score</div>
        ${hourScores.map(item => {
          const isGolden = goldenHours.includes(item.hour);
          const isSelected = item.hour === selectedUtcHour;
          return `
            <div class="h-8 flex items-center justify-center font-mono ${isGolden ? 'text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/60' : ''} ${isSelected ? 'bg-blue-600 text-white' : ''}" title="Overlap score: ${item.score}/${members.length}">
              ${item.score.toFixed(1)}
            </div>
          `;
        }).join('')}
      </div>
    `;

    grid.innerHTML = html;

    // Attach click listener to hour cells to change sync hour
    grid.querySelectorAll('[data-utc]').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const utc = parseInt(cell.getAttribute('data-utc'), 10);
        if (!isNaN(utc)) {
          selectedUtcHour = utc;
          updateCalculations();
          renderMembers();
        }
      });
    });

    // Update Golden Hour text banner
    const goldenEl = document.getElementById('goldenHourText');
    if (goldenEl) {
      if (goldenHours.length > 0) {
        const formattedHours = goldenHours.map(h => `${h < 10 ? '0' + h : h}:00 UTC`).join(', ');
        goldenEl.innerHTML = `Best Sync Window: <span class="text-blue-600 dark:text-blue-400">${formattedHours}</span> (Team Overlap: ${maxScore.toFixed(1)} / ${members.length})`;
      } else {
        goldenEl.textContent = 'No standard working hour overlap found. Recommend async updates.';
      }
    }
  }

  // Generate copyable Slack / Email Invitation
  function updateInvitePreview() {
    const previewEl = document.getElementById('invitePreviewText');
    const badgeEl = document.getElementById('selectedHourBadge');
    if (!previewEl) return;

    if (badgeEl) {
      badgeEl.textContent = `Selected: ${selectedUtcHour < 10 ? '0' + selectedUtcHour : selectedUtcHour}:00 UTC`;
    }

    let text = `📅 Global Team Sync (${selectedUtcHour < 10 ? '0' + selectedUtcHour : selectedUtcHour}:00 UTC):\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    members.forEach(m => {
      const data = getLocalTimeData(m.tz, selectedUtcHour);
      text += `• ${m.name}: ${data.formattedTime} (${data.tzName})\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Generated with PocketRuler.app Timezone Matrix`;

    previewEl.textContent = text;
  }

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msg = document.getElementById('toastMessage');
    if (!toast || !msg) return;

    msg.textContent = message || 'Copied to clipboard!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function updateCalculations() {
    renderHeatmap();
    updateInvitePreview();
  }

  // Initialize event listeners
  function init() {
    renderMembers();
    updateCalculations();

    // Add Member Button
    const addBtn = document.getElementById('addMemberBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (members.length >= 8) {
          alert('Maximum of 8 members reached for matrix readability.');
          return;
        }
        const newId = 'm_' + Date.now();
        const fallbackTz = TIMEZONE_OPTIONS[(members.length * 3) % TIMEZONE_OPTIONS.length].tz;
        members.push({
          id: newId,
          name: `Member ${members.length + 1}`,
          tz: fallbackTz
        });
        renderMembers();
        updateCalculations();
      });
    }

    // Reset Defaults
    const resetBtn = document.getElementById('resetDefaultsBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        members = JSON.parse(JSON.stringify(DEFAULT_MEMBERS));
        selectedUtcHour = 15;
        renderMembers();
        updateCalculations();
        showToast('Reset to demo distributed team!');
      });
    }

    // Copy Invite Button
    const copyBtn = document.getElementById('copyInviteBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const previewEl = document.getElementById('invitePreviewText');
        if (previewEl) {
          navigator.clipboard.writeText(previewEl.textContent).then(() => {
            showToast('Formatted invite copied to clipboard!');
          }).catch(() => {
            showToast('Selected invite text ready to copy.');
          });
        }
      });
    }
  }

  // Run on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
