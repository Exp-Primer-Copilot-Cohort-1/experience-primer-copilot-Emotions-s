function skillsMember() {
    const member = {
        name: 'John',
        age: 30,
        skills: ['HTML', 'CSS', 'JS'],
        showSkills: function() {
            this.skills.forEach(function(skill) {
                console.log(`${this.name} knows ${skill}`);
            }.bind(this));
        }
    };
    member.showSkills();
}