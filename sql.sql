
CREATE TABLE passage_performances (
performance_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
user_id INT UNSIGNED NOT NULL,
avg_wpm FLOAT NOT NULL,
passage TEXT NOT NULL,
wpmover7 VARCHAR(450),
errors VARCHAR(450),
date_saved DATE,
PRIMARY KEY (performance_id),
FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);


CREATE TABLE quicktype_performances (
performance_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
user_id INT UNSIGNED NOT NULL,
avg_wpm_10 VARCHAR(450) NOT NULL,
passage TEXT NOT NULL,
number_correct INT,
user_id VARCHAR(45),
errors VARCHAR(45),
date_saved DATE,
PRIMARY KEY (performance_id),
FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE ghosttype_performances (
performance_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
user_id INT UNSIGNED NOT NULL,
target_wpm FLOAT NOT NULL,
avg_wpm FLOAT NOT NULL,
graph_map VARCHAR(450),
ghost_wpm FLOAT NOT NULL,
head_start INT NOT NULL,
passage TEXT NOT NULL,
date_saved INT(11),
errors VARCHAR(450),
PRIMARY KEY (performance_id),
FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);
